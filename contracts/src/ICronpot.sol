// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ICronpot {
    function schedule(address target, bytes calldata data, uint64 executeAfter)
        external
        payable
        returns (uint256 jobId);
    function cancel(uint256 jobId) external;
}
