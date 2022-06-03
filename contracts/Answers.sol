//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// 1. If I undestand correct - just encode any data for storage.
contract Answers {
    bytes storageData;

    function example(string memory newData) public payable {
        storageData = abi.encode(newData);
    }
}

// 2. It is the the most difficult question, and I'm not sure that I'm really understand it.
// Bind with wallet I see only this tranzaction: executeTx or executeTxRaw which call execute(...args) undercore.
// The common target is send value and data to _tagret = recevier
//
// Not really that it looks as a swap.
// I've tried to find swap in the code, but only lp - Shop.sol works with LP (pair tokens) and /// I didn't see this code in the scripts or test to see wallet conntecting
// I think that this answer to your question is not fully correct or absolutelly incorect, and if it possible, I want to discuss it to better understanding)

// 3. It is UUPS type, because of it is the cheapest gas variant, and it is the oppenzeppelin undercore technology.

// 4. keccak256(abi.encode(...args));

// 5.
contract SuperEasyContract is Initializable {
    uint8 value;

    function initialize() public initializer {}

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function incriment() public {
        value++;
    }
}

contract SuperEasyContractV2 is Initializable {
    uint8 value;

    function initialize() public initializer {}

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function increment() public {
        value++;
    }

    function decrement() public {
        value--;
    }
}

// import { ethers, upgrades } from "hardhat";
//import { SuperEasyContract, SuperEasyContractV2 } from '../../typechain-types'

// async function main () {
//   const [owner] = await ethers.getSigners();
//   const SuperEasyContractFactory = await ethers.getContractFactory('SuperEasyContract');
//   const superEasyContract = (await upgrades.deployProxy(SuperEasyContractFactory)) as SuperEasyContract;
//   const SuperEasyContractFactoryV2 = await ethers.getContractFactory('SuperEasyContractV2');
//   const superEasyContractV2 = (await upgrades.upgrateProxy(superEasyContract, SuperEasyContractFactoryV2)) as SuperEasyContractV2;
// }
