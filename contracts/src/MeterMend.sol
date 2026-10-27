// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ICronpot} from "./ICronpot.sol";

/// @notice Rental deposits, item-specific maintenance reserves and human dispute decisions.
/// @dev Refunds are checked push payments. A rejecting recipient keeps its liability unresolved.
contract MeterMend {
    enum RentalStatus {
        None,
        Active,
        Returned,
        Disputed,
        Closed
    }

    struct Item {
        address operator;
        address arbiter;
        uint128 fee;
        uint128 deposit;
        uint16 reserveBps;
        uint32 disputeWindow;
        bool active;
        bool rented;
        uint256 reserve;
        string metadataURI;
    }

    struct Rental {
        uint256 itemId;
        address renter;
        uint128 deposit;
        uint64 startedAt;
        uint64 refundAt;
        RentalStatus status;
        uint256 cronJobId;
    }

    struct Dispute {
        uint128 amount;
        bytes32 evidenceHash;
        bool renterVoted;
        bool renterApproved;
        bool arbiterVoted;
        bool arbiterApproved;
    }

    struct Repair {
        uint256 itemId;
        address repairer;
        uint128 amount;
        bytes32 receiptHash;
        bool paid;
        bool rejected;
    }

    ICronpot public immutable cronpot;
    uint128 public immutable cronTip;
    uint256 public nextItemId = 1;
    uint256 public nextRentalId = 1;
    uint256 public nextRepairId = 1;
    mapping(uint256 => Item) public items;
    mapping(uint256 => Rental) public rentals;
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => Repair) public repairs;
    mapping(address => uint256) public operatorIncome;
    mapping(uint256 => uint256) public unsettledRentals;
    bool private entered;

    error NotOperator();
    error NotArbiter();
    error NotParty();
    error BadParams();
    error WrongValue(uint256 expected);
    error ItemUnavailable();
    error BadStatus();
    error WindowOpen(uint64 refundAt);
    error WindowClosed();
    error AlreadyVoted();
    error InsufficientReserve();
    error Reentrant();
    error TransferFailed();

    event ItemRegistered(
        uint256 indexed itemId,
        address indexed operator,
        address arbiter,
        uint128 fee,
        uint128 deposit,
        uint16 reserveBps,
        uint32 disputeWindow,
        string metadataURI
    );
    event ItemUpdated(uint256 indexed itemId, uint128 fee, uint128 deposit, bool active);
    event Rented(
        uint256 indexed rentalId,
        uint256 indexed itemId,
        address indexed renter,
        uint128 fee,
        uint128 toReserve,
        uint128 deposit
    );
    event Returned(
        uint256 indexed rentalId,
        uint256 indexed itemId,
        bytes32 evidenceHash,
        uint64 refundAt,
        uint256 cronJobId
    );
    event DepositRefunded(
        uint256 indexed rentalId, uint256 indexed itemId, address indexed renter, uint128 amount
    );
    event DisputeOpened(
        uint256 indexed rentalId, uint256 indexed itemId, uint128 amount, bytes32 evidenceHash
    );
    event DisputeVote(uint256 indexed rentalId, address indexed voter, bool approve);
    event DisputeResolved(
        uint256 indexed rentalId, uint256 indexed itemId, uint128 deducted, uint128 refunded
    );
    event RepairProposed(
        uint256 indexed repairId,
        uint256 indexed itemId,
        address indexed repairer,
        uint128 amount,
        bytes32 receiptHash
    );
    event RepairPaid(
        uint256 indexed repairId, uint256 indexed itemId, address indexed repairer, uint128 amount
    );
    event RepairRejected(uint256 indexed repairId, uint256 indexed itemId);
    event ItemTransferred(
        uint256 indexed itemId, address indexed from, address indexed to, uint256 reserveCarried
    );
    event IncomeWithdrawn(address indexed operator, uint256 amount);

    modifier nonReentrant() {
        if (entered) revert Reentrant();
        entered = true;
        _;
        entered = false;
    }

    constructor(ICronpot cronpot_, uint128 cronTip_) {
        if (address(cronpot_) == address(0)) revert BadParams();
        cronpot = cronpot_;
        cronTip = cronTip_;
    }

    function registerItem(
        address arbiter,
        uint128 fee,
        uint128 deposit,
        uint16 reserveBps,
        uint32 disputeWindow,
        string calldata metadataURI
    ) external nonReentrant returns (uint256 itemId) {
        if (
            arbiter == address(0) || arbiter == msg.sender || reserveBps > 5000 || disputeWindow < 60
                || disputeWindow > 30 days
        ) revert BadParams();
        itemId = nextItemId++;
        items[itemId] =
            Item(msg.sender, arbiter, fee, deposit, reserveBps, disputeWindow, true, false, 0, metadataURI);
        emit ItemRegistered(itemId, msg.sender, arbiter, fee, deposit, reserveBps, disputeWindow, metadataURI);
    }

    function updateItem(uint256 itemId, uint128 fee, uint128 deposit, bool active) external nonReentrant {
        Item storage item = _item(itemId);
        _operator(item);
        if (item.rented) revert ItemUnavailable();
        item.fee = fee;
        item.deposit = deposit;
        item.active = active;
        emit ItemUpdated(itemId, fee, deposit, active);
    }

    function rent(uint256 itemId) external payable nonReentrant returns (uint256 rentalId) {
        Item storage item = _item(itemId);
        if (!item.active || item.rented) revert ItemUnavailable();
        if (msg.sender == item.operator || msg.sender == item.arbiter) revert NotParty();
        uint256 expected = uint256(item.fee) + uint256(item.deposit);
        if (msg.value != expected) revert WrongValue(expected);
        uint128 toReserve = uint128(uint256(item.fee) * item.reserveBps / 10_000);
        item.reserve += toReserve;
        operatorIncome[item.operator] += uint256(item.fee) - toReserve;
        item.rented = true;
        ++unsettledRentals[itemId];
        rentalId = nextRentalId++;
        rentals[rentalId] =
            Rental(itemId, msg.sender, item.deposit, _timestamp(block.timestamp), 0, RentalStatus.Active, 0);
        emit Rented(rentalId, itemId, msg.sender, item.fee, toReserve, item.deposit);
    }

    function markReturned(uint256 rentalId, bytes32 evidenceHash) external payable nonReentrant {
        Rental storage rental = _rental(rentalId);
        Item storage item = items[rental.itemId];
        _operator(item);
        if (rental.status != RentalStatus.Active) revert BadStatus();
        if (msg.value != cronTip) revert WrongValue(cronTip);
        rental.status = RentalStatus.Returned;
        rental.refundAt = _timestamp(block.timestamp + item.disputeWindow);
        item.rented = false;
        uint256 jobId = cronpot.schedule{value: msg.value}(
            address(this), abi.encodeCall(this.finalizeRefund, (rentalId)), rental.refundAt
        );
        rental.cronJobId = jobId;
        emit Returned(rentalId, rental.itemId, evidenceHash, rental.refundAt, jobId);
    }

    function finalizeRefund(uint256 rentalId) external nonReentrant {
        Rental storage rental = _rental(rentalId);
        if (rental.status != RentalStatus.Returned) revert BadStatus();
        if (block.timestamp < rental.refundAt) revert WindowOpen(rental.refundAt);
        uint128 amount = rental.deposit;
        rental.deposit = 0;
        rental.status = RentalStatus.Closed;
        --unsettledRentals[rental.itemId];
        _pay(rental.renter, amount);
        emit DepositRefunded(rentalId, rental.itemId, rental.renter, amount);
    }

    function openDispute(uint256 rentalId, uint128 amount, bytes32 evidenceHash) external nonReentrant {
        Rental storage rental = _rental(rentalId);
        _operator(items[rental.itemId]);
        if (rental.status != RentalStatus.Returned) revert BadStatus();
        if (block.timestamp >= rental.refundAt) revert WindowClosed();
        if (amount == 0 || amount > rental.deposit) revert BadParams();
        rental.status = RentalStatus.Disputed;
        disputes[rentalId] = Dispute(amount, evidenceHash, false, false, false, false);
        // The dispute is authoritative even if a scheduler job could not be cancelled.
        try cronpot.cancel(rental.cronJobId) {} catch {}
        emit DisputeOpened(rentalId, rental.itemId, amount, evidenceHash);
    }

    function voteDispute(uint256 rentalId, bool approve) external nonReentrant {
        Rental storage rental = _rental(rentalId);
        if (rental.status != RentalStatus.Disputed) revert BadStatus();
        Dispute storage dispute = disputes[rentalId];
        if (msg.sender == rental.renter) {
            if (dispute.renterVoted) revert AlreadyVoted();
            dispute.renterVoted = true;
            dispute.renterApproved = approve;
        } else if (msg.sender == items[rental.itemId].arbiter) {
            if (dispute.arbiterVoted) revert AlreadyVoted();
            dispute.arbiterVoted = true;
            dispute.arbiterApproved = approve;
        } else {
            revert NotParty();
        }
        emit DisputeVote(rentalId, msg.sender, approve);
        if (approve) _resolve(rentalId, dispute.amount);
        else if (dispute.renterVoted && dispute.arbiterVoted) _resolve(rentalId, 0);
    }

    function _resolve(uint256 rentalId, uint128 deducted) private {
        Rental storage rental = rentals[rentalId];
        uint128 refunded = rental.deposit - deducted;
        rental.deposit = 0;
        rental.status = RentalStatus.Closed;
        --unsettledRentals[rental.itemId];
        items[rental.itemId].reserve += deducted;
        _pay(rental.renter, refunded);
        emit DisputeResolved(rentalId, rental.itemId, deducted, refunded);
    }

    function proposeRepair(uint256 itemId, address repairer, uint128 amount, bytes32 receiptHash)
        external
        nonReentrant
        returns (uint256 repairId)
    {
        Item storage item = _item(itemId);
        _operator(item);
        if (repairer == address(0) || amount == 0) revert BadParams();
        if (amount > item.reserve) revert InsufficientReserve();
        repairId = nextRepairId++;
        repairs[repairId] = Repair(itemId, repairer, amount, receiptHash, false, false);
        emit RepairProposed(repairId, itemId, repairer, amount, receiptHash);
    }

    function decideRepair(uint256 repairId, bool approve) external nonReentrant {
        Repair storage repair = repairs[repairId];
        if (repair.itemId == 0) revert BadParams();
        Item storage item = items[repair.itemId];
        if (msg.sender != item.arbiter) revert NotArbiter();
        if (repair.paid || repair.rejected) revert BadStatus();
        if (!approve) {
            repair.rejected = true;
            emit RepairRejected(repairId, repair.itemId);
        } else {
            if (repair.amount > item.reserve) revert InsufficientReserve();
            repair.paid = true;
            item.reserve -= repair.amount;
            _pay(repair.repairer, repair.amount);
            emit RepairPaid(repairId, repair.itemId, repair.repairer, repair.amount);
        }
    }

    function transferItem(uint256 itemId, address newOperator) external nonReentrant {
        Item storage item = _item(itemId);
        _operator(item);
        if (item.rented || unsettledRentals[itemId] != 0) revert ItemUnavailable();
        if (newOperator == address(0) || newOperator == item.arbiter) revert BadParams();
        address previous = item.operator;
        item.operator = newOperator;
        emit ItemTransferred(itemId, previous, newOperator, item.reserve);
    }

    function withdrawIncome() external nonReentrant {
        uint256 amount = operatorIncome[msg.sender];
        operatorIncome[msg.sender] = 0;
        _pay(msg.sender, amount);
        emit IncomeWithdrawn(msg.sender, amount);
    }

    function _item(uint256 itemId) private view returns (Item storage item) {
        item = items[itemId];
        if (item.operator == address(0)) revert BadParams();
    }

    function _rental(uint256 rentalId) private view returns (Rental storage rental) {
        rental = rentals[rentalId];
        if (rental.status == RentalStatus.None) revert BadParams();
    }

    function _operator(Item storage item) private view {
        if (msg.sender != item.operator) revert NotOperator();
    }

    function _timestamp(uint256 value) private pure returns (uint64) {
        if (value > type(uint64).max) revert BadParams();
        return uint64(value);
    }

    function _pay(address recipient, uint256 amount) private {
        if (amount == 0) return;
        (bool ok,) = recipient.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /// @dev Cancelled Cronpot tips and unsolicited payments are unallocated surplus, not operator income.
    receive() external payable {}
}
