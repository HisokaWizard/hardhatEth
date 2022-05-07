//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

contract EasyContract {
    uint256 public workingValue;

    function plus(uint256 value) public {
        workingValue += value;
        emit wasPlus(workingValue);
    }

    function minus(uint256 value) public {
        workingValue -= value;
        emit wasMinus(workingValue);
    }

    function multiple(uint256 value) public {
        workingValue *= value;
        emit wasMultiple(workingValue);
    }

    function divide(uint256 value) public {
        workingValue /= value;
        emit wasDivide(workingValue);
    }

    event wasPlus(uint256 resultValue);
    event wasMinus(uint256 resultValue);
    event wasMultiple(uint256 resultValue);
    event wasDivide(uint256 resultValue);
}
