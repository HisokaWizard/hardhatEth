//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";

contract PayContract {
    struct ContractItem {
        string contractContent;
        uint salePrice;
        address vendor;
    }

    address private owner;
    mapping(uint => ContractItem) private vendors;
    uint[] private allItemHash;
    uint public contractPrice = 1 ether;

    constructor() {
        owner = msg.sender;
    }

    function setVendor(ContractItem memory _data) public {
      uint contractHash = uint(keccak256(abi.encodePacked(_data.contractContent)));
      require(vendors[contractHash].vendor == address(0) && _data.vendor == msg.sender && _data.vendor != owner);
      allItemHash.push(contractHash);
      vendors[contractHash] = _data;
    }

    function getVendorContract(uint _hash) public view returns(ContractItem memory) {
      return vendors[_hash];
    }

    function getAllContractsHash() public view returns(uint[] memory) {
      return allItemHash;
    }

    function makeSale(address _customer, uint _hash) external payable {
      console.log(_customer, _hash, msg.sender, msg.value);
      require(msg.value == vendors[_hash].salePrice * 1000000000000000000 + contractPrice);
      payable(vendors[_hash].vendor).transfer(msg.value - contractPrice);
      payable(owner).transfer(contractPrice);
      vendors[_hash].vendor = _customer;
    }

    function changeItemData(uint _salePrice, uint _hash) public {
        require(vendors[_hash].vendor == msg.sender);
        vendors[_hash].salePrice = _salePrice;
    }
}