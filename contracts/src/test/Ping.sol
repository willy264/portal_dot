// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Ping {
    uint256 public count;
    event Pinged(address indexed caller, uint256 count, uint256 value);

    function ping() external payable {
        ++count;
        emit Pinged(msg.sender, count, msg.value);
    }
}
