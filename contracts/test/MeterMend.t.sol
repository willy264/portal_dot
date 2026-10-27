// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TestBase} from "./TestBase.sol";
import {MeterMend} from "../src/MeterMend.sol";
import {Cronpot} from "../src/Cronpot.sol";
import {ICronpot} from "../src/ICronpot.sol";

contract ContractRenter {
    MeterMend public meter;
    uint256 public rental;
    bool public reject;
    bool public attack;
    bool public reentrySucceeded;

    constructor(MeterMend meter_) {
        meter = meter_;
    }

    function rent(uint256 id) external payable {
        rental = meter.rent{value: msg.value}(id);
    }

    function setReject(bool value) external {
        reject = value;
    }

    function setAttack() external {
        attack = true;
    }

    receive() external payable {
        require(!reject, "no refund");
        if (attack) {
            (reentrySucceeded,) = address(meter).call(abi.encodeCall(meter.finalizeRefund, (rental)));
        }
    }
}

contract UncancellableCronpot is ICronpot {
    address public target;
    bytes public data;

    function schedule(address target_, bytes calldata data_, uint64) external payable returns (uint256) {
        target = target_;
        data = data_;
        return 1;
    }

    function cancel(uint256) external pure {
        revert("cancel unavailable");
    }

    function run() external returns (bool ok) {
        (ok,) = target.call(data);
    }
}

contract MeterMendTest is TestBase {
    MeterMend meter;
    Cronpot cron;
    address constant RENTER = address(0xB0B);
    address constant ARBITER = address(0xA11CE);
    address constant REPAIRER = address(0xC0FE);
    address constant KEEPER = address(0xD00D);
    address constant NEW_OPERATOR = address(0xCAFE);
    uint128 constant FEE = 100;
    uint128 constant DEPOSIT = 500;
    uint128 constant TIP = 3;
    uint32 constant WINDOW = 120;
    bytes32 constant EVIDENCE = keccak256("final stored photo bytes");
    uint256 item;

    function setUp() public {
        vm.warp(1000);
        vm.deal(address(this), 10 ether);
        vm.deal(RENTER, 10 ether);
        vm.deal(ARBITER, 10 ether);
        cron = new Cronpot();
        meter = new MeterMend(cron, TIP);
        item = meter.registerItem(ARBITER, FEE, DEPOSIT, 2000, WINDOW, "ipfs://camera");
    }

    function _rent() internal returns (uint256 id) {
        vm.prank(RENTER);
        id = meter.rent{value: FEE + DEPOSIT}(item);
    }

    function _returned() internal returns (uint256 id) {
        id = _rent();
        meter.markReturned{value: TIP}(id, EVIDENCE);
    }

    function _disputed(uint128 amount) internal returns (uint256 id) {
        id = _returned();
        meter.openDispute(id, amount, EVIDENCE);
    }

    function _reserve(uint256 id) internal view returns (uint256 value) {
        (,,,,,,,, value,) = meter.items(id);
    }

    function _rented(uint256 id) internal view returns (bool value) {
        (,,,,,,, value,,) = meter.items(id);
    }

    function _status(uint256 id) internal view returns (MeterMend.RentalStatus value) {
        (,,,,, value,) = meter.rentals(id);
    }

    function _deposit(uint256 id) internal view returns (uint128 value) {
        (,, value,,,,) = meter.rentals(id);
    }

    function _job(uint256 id) internal view returns (uint256 value) {
        (,,,,,, value) = meter.rentals(id);
    }

    function _deadline(uint256 id) internal view returns (uint64 value) {
        (,,,, value,,) = meter.rentals(id);
    }

    function test_RentSplitsFeeIntoReserve() public {
        _rent();
        assertEq(_reserve(item), 20);
        assertEq(meter.operatorIncome(address(this)), 80);
        assertEq(address(meter).balance, 600);
        assertEq(meter.unsettledRentals(item), 1);
    }

    function test_RentWrongValueReverts() public {
        vm.prank(RENTER);
        vm.expectRevert(abi.encodeWithSelector(MeterMend.WrongValue.selector, uint256(600)));
        meter.rent{value: 599}(item);
        assertFalse(_rented(item));
    }

    function test_ItemCannotBeDoubleRented() public {
        _rent();
        vm.prank(RENTER);
        vm.expectRevert(MeterMend.ItemUnavailable.selector);
        meter.rent{value: 600}(item);
    }

    function test_MarkReturnedSchedulesCronJob() public {
        uint256 id = _returned();
        Cronpot.Job memory job = cron.getJob(_job(id));
        assertEq(job.owner, address(meter));
        assertEq(job.target, address(meter));
        assertEq(job.executeAfter, 1120);
        assertEq(job.tip, TIP);
        assertEq(keccak256(job.data), keccak256(abi.encodeCall(meter.finalizeRefund, (id))));
        assertEq(_deadline(id), 1120);
        assertFalse(_rented(item));
        assertEq(meter.unsettledRentals(item), 1);
    }

    function test_FinalizeRefundBeforeWindowReverts() public {
        uint256 id = _returned();
        vm.expectRevert(abi.encodeWithSelector(MeterMend.WindowOpen.selector, uint64(1120)));
        meter.finalizeRefund(id);
        assertEq(_deposit(id), DEPOSIT);
    }

    function test_CronpotExecutesRefundAfterWindow() public {
        uint256 id = _returned();
        uint256 job = _job(id);
        vm.warp(1120);
        uint256 before = RENTER.balance;
        vm.prank(KEEPER);
        cron.execute(job);
        assertEq(RENTER.balance - before, DEPOSIT);
        assertEq(uint256(_status(id)), uint256(MeterMend.RentalStatus.Closed));
        assertEq(_deposit(id), 0);
        assertEq(uint256(cron.getJob(job).status), uint256(Cronpot.Status.Executed));
        assertEq(KEEPER.balance, TIP);
        assertEq(meter.unsettledRentals(item), 0);
    }

    function test_AnyoneCanFinalizeWithoutCronpot() public {
        uint256 id = _returned();
        vm.warp(1120);
        vm.prank(KEEPER);
        meter.finalizeRefund(id);
        assertEq(_deposit(id), 0);
        cron.execute(_job(id));
        assertEq(uint256(cron.getJob(_job(id)).status), uint256(Cronpot.Status.Failed));
        assertEq(address(meter).balance, 100);
    }

    function test_DisputeApprovedByRenter() public {
        uint256 id = _disputed(150);
        uint256 before = RENTER.balance;
        vm.prank(RENTER);
        meter.voteDispute(id, true);
        assertEq(_reserve(item), 170);
        assertEq(RENTER.balance - before, 350);
        assertEq(_deposit(id), 0);
        assertEq(meter.unsettledRentals(item), 0);
    }

    function test_DisputeApprovedByArbiter() public {
        uint256 id = _disputed(150);
        vm.prank(ARBITER);
        meter.voteDispute(id, true);
        assertEq(_reserve(item), 170);
        assertEq(uint256(_status(id)), uint256(MeterMend.RentalStatus.Closed));
    }

    function test_DisputeRejectedByBothRefundsFully() public {
        uint256 id = _disputed(150);
        uint256 before = RENTER.balance;
        vm.prank(RENTER);
        meter.voteDispute(id, false);
        assertEq(_deposit(id), DEPOSIT);
        vm.prank(ARBITER);
        meter.voteDispute(id, false);
        assertEq(RENTER.balance - before, DEPOSIT);
        assertEq(_reserve(item), 20);
    }

    function test_DisputeAfterWindowReverts() public {
        uint256 id = _returned();
        vm.warp(1120);
        vm.expectRevert(MeterMend.WindowClosed.selector);
        meter.openDispute(id, 150, EVIDENCE);
        meter.finalizeRefund(id);
    }

    function test_ScheduledRefundCannotFireDuringDispute() public {
        uint256 id = _disputed(150);
        uint256 job = _job(id);
        vm.warp(1120);
        assertEq(uint256(cron.getJob(job).status), uint256(Cronpot.Status.Cancelled));
        vm.expectRevert(Cronpot.NotScheduled.selector);
        cron.execute(job);
        vm.expectRevert(MeterMend.BadStatus.selector);
        meter.finalizeRefund(id);
        assertEq(_deposit(id), DEPOSIT);
    }

    function test_DisputeSurvivesFailedCronCancellation() public {
        UncancellableCronpot stubborn = new UncancellableCronpot();
        MeterMend other = new MeterMend(stubborn, TIP);
        uint256 otherItem = other.registerItem(ARBITER, FEE, DEPOSIT, 2000, WINDOW, "camera");
        vm.prank(RENTER);
        uint256 id = other.rent{value: 600}(otherItem);
        other.markReturned{value: TIP}(id, EVIDENCE);
        other.openDispute(id, 100, EVIDENCE);
        vm.warp(1120);
        assertFalse(stubborn.run());
        (,, uint128 held,,,,) = other.rentals(id);
        assertEq(held, DEPOSIT);
    }

    function test_RepairRequiresArbiter() public {
        _rent();
        uint256 repair = meter.proposeRepair(item, REPAIRER, 15, EVIDENCE);
        vm.expectRevert(MeterMend.NotArbiter.selector);
        meter.decideRepair(repair, true);
    }

    function test_RepairPaysFromReserveOnly() public {
        _rent();
        uint256 repair = meter.proposeRepair(item, REPAIRER, 15, EVIDENCE);
        vm.prank(ARBITER);
        meter.decideRepair(repair, true);
        assertEq(_reserve(item), 5);
        assertEq(REPAIRER.balance, 15);
        assertEq(meter.operatorIncome(address(this)), 80);
        assertEq(address(meter).balance, 585);
        vm.prank(ARBITER);
        vm.expectRevert(MeterMend.BadStatus.selector);
        meter.decideRepair(repair, true);
    }

    function test_RepairCannotExceedReserve() public {
        _rent();
        vm.expectRevert(MeterMend.InsufficientReserve.selector);
        meter.proposeRepair(item, REPAIRER, 21, EVIDENCE);
        uint256 first = meter.proposeRepair(item, REPAIRER, 15, EVIDENCE);
        uint256 second = meter.proposeRepair(item, REPAIRER, 15, EVIDENCE);
        vm.prank(ARBITER);
        meter.decideRepair(first, true);
        vm.prank(ARBITER);
        vm.expectRevert(MeterMend.InsufficientReserve.selector);
        meter.decideRepair(second, true);
    }

    function test_OperatorCannotWithdrawReserve() public {
        _rent();
        uint256 before = address(this).balance;
        meter.withdrawIncome();
        meter.withdrawIncome();
        assertEq(address(this).balance - before, 80);
        assertEq(_reserve(item), 20);
        assertEq(address(meter).balance, 520);
    }

    function test_TransferCarriesReserve() public {
        uint256 id = _returned();
        vm.warp(1120);
        meter.finalizeRefund(id);
        meter.transferItem(item, NEW_OPERATOR);
        (address owner,,,,,,,,,) = meter.items(item);
        assertEq(owner, NEW_OPERATOR);
        assertEq(_reserve(item), 20);
        assertEq(meter.operatorIncome(address(this)), 80);
        assertEq(meter.operatorIncome(NEW_OPERATOR), 0);
    }

    function test_TransferBlockedForReturnedAndDisputedRentals() public {
        uint256 id = _returned();
        vm.expectRevert(MeterMend.ItemUnavailable.selector);
        meter.transferItem(item, NEW_OPERATOR);
        meter.openDispute(id, 100, EVIDENCE);
        vm.expectRevert(MeterMend.ItemUnavailable.selector);
        meter.transferItem(item, RENTER);
        vm.prank(ARBITER);
        meter.voteDispute(id, true);
        meter.transferItem(item, NEW_OPERATOR);
    }

    function test_OldRentalClosureCannotClearNewOccupancy() public {
        uint256 old = _returned();
        uint256 current = _rent();
        vm.warp(1120);
        meter.finalizeRefund(old);
        assertTrue(_rented(item));
        assertEq(meter.unsettledRentals(item), 1);
        assertEq(uint256(_status(current)), uint256(MeterMend.RentalStatus.Active));
        vm.expectRevert(MeterMend.ItemUnavailable.selector);
        meter.transferItem(item, NEW_OPERATOR);
    }

    function test_RenterCannotBeOperatorOrArbiter() public {
        vm.expectRevert(MeterMend.NotParty.selector);
        meter.rent{value: 600}(item);
        vm.prank(ARBITER);
        vm.expectRevert(MeterMend.NotParty.selector);
        meter.rent{value: 600}(item);
    }

    function test_VoteOnceAndNoUnspecifiedDisputeTimeout() public {
        uint256 id = _disputed(100);
        vm.prank(RENTER);
        meter.voteDispute(id, false);
        vm.prank(RENTER);
        vm.expectRevert(MeterMend.AlreadyVoted.selector);
        meter.voteDispute(id, true);
        vm.warp(365 days);
        vm.expectRevert(MeterMend.BadStatus.selector);
        meter.finalizeRefund(id);
        assertEq(_deposit(id), DEPOSIT);
        vm.prank(ARBITER);
        meter.voteDispute(id, false);
        assertEq(_deposit(id), 0);
    }

    function test_RejectingRefundPreservesLiabilityAndTransferLock() public {
        ContractRenter receiver = new ContractRenter(meter);
        receiver.rent{value: 600}(item);
        uint256 id = receiver.rental();
        meter.markReturned{value: TIP}(id, EVIDENCE);
        receiver.setReject(true);
        vm.warp(1120);
        vm.expectRevert(MeterMend.TransferFailed.selector);
        meter.finalizeRefund(id);
        assertEq(_deposit(id), DEPOSIT);
        assertEq(meter.unsettledRentals(item), 1);
        assertEq(uint256(_status(id)), uint256(MeterMend.RentalStatus.Returned));
        assertEq(address(meter).balance, 600);
        receiver.setReject(false);
        meter.finalizeRefund(id);
        assertEq(address(receiver).balance, DEPOSIT);
    }

    function test_FullDeductionSkipsRejectingZeroValueRecipient() public {
        ContractRenter receiver = new ContractRenter(meter);
        receiver.rent{value: 600}(item);
        uint256 id = receiver.rental();
        meter.markReturned{value: TIP}(id, EVIDENCE);
        receiver.setReject(true);
        meter.openDispute(id, DEPOSIT, EVIDENCE);
        vm.prank(ARBITER);
        meter.voteDispute(id, true);
        assertEq(_reserve(item), 520);
        assertEq(_deposit(id), 0);
        assertEq(meter.unsettledRentals(item), 0);
    }

    function test_RefundCallbackCannotReenterSettlement() public {
        ContractRenter receiver = new ContractRenter(meter);
        receiver.rent{value: 600}(item);
        uint256 id = receiver.rental();
        meter.markReturned{value: TIP}(id, EVIDENCE);
        receiver.setAttack();
        vm.warp(1120);
        meter.finalizeRefund(id);
        assertFalse(receiver.reentrySucceeded());
        assertEq(address(receiver).balance, DEPOSIT);
        assertEq(_deposit(id), 0);
    }

    function test_MaximumFeeAndDepositUseWideIntermediates() public {
        meter.updateItem(item, type(uint128).max, type(uint128).max, true);
        uint256 expected = uint256(type(uint128).max) * 2;
        vm.deal(RENTER, expected);
        vm.prank(RENTER);
        meter.rent{value: expected}(item);
        assertEq(_reserve(item) + meter.operatorIncome(address(this)), type(uint128).max);
        assertEq(address(meter).balance, expected);
    }

    function test_MultipleItemLiabilitiesAndCancellationSurplusStaySeparated() public {
        uint256 id = _returned();
        uint256 second = meter.registerItem(ARBITER, 200, 300, 1000, WINDOW, "drill");
        vm.prank(RENTER);
        uint256 secondRental = meter.rent{value: 500}(second);
        meter.openDispute(id, 100, EVIDENCE);
        vm.prank(ARBITER);
        meter.voteDispute(id, true);
        uint256 liabilities = _reserve(item) + _reserve(second) + meter.operatorIncome(address(this))
            + _deposit(id) + _deposit(secondRental);
        assertEq(address(meter).balance, liabilities + TIP);
        uint256 repair = meter.proposeRepair(item, REPAIRER, 50, EVIDENCE);
        vm.prank(ARBITER);
        meter.decideRepair(repair, true);
        meter.withdrawIncome();
        liabilities = _reserve(item) + _reserve(second) + _deposit(secondRental);
        assertEq(address(meter).balance, liabilities + TIP);
        assertEq(_reserve(second), 20);
    }

    function testFuzz_SplitNeverLosesFunds(uint128 fee, uint16 bps) public {
        bps %= 5001;
        uint256 id = meter.registerItem(ARBITER, fee, 0, bps, WINDOW, "fuzz");
        vm.deal(RENTER, fee);
        vm.prank(RENTER);
        meter.rent{value: fee}(id);
        assertEq(_reserve(id) + meter.operatorIncome(address(this)), fee);
        assertEq(_reserve(id), uint256(fee) * bps / 10_000);
    }
}
