// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ICronpot} from "./ICronpot.sol";

/// @notice Permissionless, prepaid execution. Timing is a minimum, not an execution guarantee.
/// @dev Targets receive at most TARGET_GAS_LIMIT. Failed jobs are terminal and are not retried.
contract Cronpot is ICronpot {
    enum Status {
        None,
        Scheduled,
        Executed,
        Cancelled,
        Failed
    }

    struct Job {
        address owner;
        address target;
        uint64 executeAfter;
        Status status;
        uint128 tip;
        bytes data;
    }

    uint256 public constant TARGET_GAS_LIMIT = 1_000_000;
    uint256 public constant POST_CALL_GAS_RESERVE = 100_000;
    uint256 public constant TIP_GAS_LIMIT = 30_000;
    uint256 public constant MAX_RETURN_DATA = 4096;
    // Covers EIP-150's 63/64 cap, cold CALL costs and instructions between the check and CALL.
    uint256 public constant MIN_CALL_GAS =
        TARGET_GAS_LIMIT + TARGET_GAS_LIMIT / 63 + 10_000 + POST_CALL_GAS_RESERVE;

    uint256 public nextJobId = 1;
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256) public tipCredits;
    bool private entered;

    error NotOwner();
    error NotScheduled();
    error TooEarly(uint64 deadline);
    error Reentrant();
    error BadParams();
    error TipTooLarge();
    error TransferFailed();
    error InsufficientExecutionGas(uint256 required);

    event JobScheduled(
        uint256 indexed jobId,
        address indexed owner,
        address indexed target,
        uint64 executeAfter,
        uint128 tip,
        bytes data
    );
    event JobCancelled(uint256 indexed jobId);
    event JobExecuted(uint256 indexed jobId, address indexed executor, bool success, bytes returnData);
    event ReturnDataTruncated(uint256 indexed jobId, uint256 originalLength, uint256 copiedLength);
    event TipDeferred(uint256 indexed jobId, address indexed executor, uint256 amount);
    event TipCreditWithdrawn(address indexed executor, uint256 amount);

    modifier nonReentrant() {
        if (entered) revert Reentrant();
        entered = true;
        _;
        entered = false;
    }

    function schedule(address target, bytes calldata data, uint64 executeAfter)
        external
        payable
        nonReentrant
        returns (uint256 jobId)
    {
        if (target == address(0)) revert BadParams();
        if (msg.value > type(uint128).max) revert TipTooLarge();
        jobId = nextJobId++;
        jobs[jobId] = Job(msg.sender, target, executeAfter, Status.Scheduled, uint128(msg.value), data);
        emit JobScheduled(jobId, msg.sender, target, executeAfter, uint128(msg.value), data);
    }

    function cancel(uint256 jobId) external nonReentrant {
        Job storage job = jobs[jobId];
        if (job.owner != msg.sender) revert NotOwner();
        if (job.status != Status.Scheduled) revert NotScheduled();
        uint256 tip = job.tip;
        job.status = Status.Cancelled;
        job.tip = 0;
        if (tip != 0) {
            (bool ok,) = msg.sender.call{value: tip}("");
            if (!ok) revert TransferFailed();
        }
        emit JobCancelled(jobId);
    }

    function execute(uint256 jobId) external nonReentrant {
        Job storage job = jobs[jobId];
        if (job.status != Status.Scheduled) revert NotScheduled();
        if (block.timestamp < job.executeAfter) revert TooEarly(job.executeAfter);
        bytes memory data = job.data;
        address target = job.target;
        uint256 tip = job.tip;
        // Prevent callbacks from observing a cancellable/executable funded job.
        job.status = Status.Executed;
        job.tip = 0;
        (bool success, bytes memory returnData, uint256 originalLength) = _boundedCall(target, data);
        if (!success) job.status = Status.Failed;
        if (originalLength > MAX_RETURN_DATA) {
            emit ReturnDataTruncated(jobId, originalLength, returnData.length);
        }
        if (tip != 0 && !_payTip(msg.sender, tip)) {
            tipCredits[msg.sender] += tip;
            emit TipDeferred(jobId, msg.sender, tip);
        }
        emit JobExecuted(jobId, msg.sender, success, returnData);
    }

    function _boundedCall(address target, bytes memory data)
        private
        returns (bool success, bytes memory result, uint256 originalLength)
    {
        // A revert here restores the original job, including status and tip.
        if (gasleft() < MIN_CALL_GAS) revert InsufficientExecutionGas(MIN_CALL_GAS);
        uint256 allowance = TARGET_GAS_LIMIT;
        uint256 cap = MAX_RETURN_DATA;
        assembly ("memory-safe") {
            success := call(allowance, target, 0, add(data, 32), mload(data), 0, 0)
            originalLength := returndatasize()
            let copied := originalLength
            if gt(copied, cap) { copied := cap }
            result := mload(0x40)
            mstore(result, copied)
            returndatacopy(add(result, 32), 0, copied)
            mstore(0x40, and(add(add(result, 63), copied), not(31)))
        }
    }

    function _payTip(address executor, uint256 amount) private returns (bool ok) {
        uint256 allowance = TIP_GAS_LIMIT;
        // Do not copy arbitrary return data from an executor's payment callback.
        assembly ("memory-safe") { ok := call(allowance, executor, amount, 0, 0, 0, 0) }
    }

    function withdrawTipCredit() external nonReentrant {
        uint256 amount = tipCredits[msg.sender];
        tipCredits[msg.sender] = 0;
        if (amount != 0) {
            (bool ok,) = msg.sender.call{value: amount}("");
            if (!ok) revert TransferFailed();
        }
        emit TipCreditWithdrawn(msg.sender, amount);
    }

    function isDue(uint256 jobId) external view returns (bool) {
        Job storage job = jobs[jobId];
        return job.status == Status.Scheduled && block.timestamp >= job.executeAfter;
    }

    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }
}
