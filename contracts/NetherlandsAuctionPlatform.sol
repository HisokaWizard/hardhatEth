//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";

contract NetherLandsAuctionPlatform {
    struct Auction {
        string item;
        uint256 startPrice;
        uint256 endPrice;
        uint256 startTime;
        uint256 endTime;
        uint256 duration;
        uint256 sale;
        address seller;
        bool finished;
    }

    address public owner;
    uint8 private constant FEE = 5;
    uint32 private constant DURATION = 5 days;

    event AuctionCreated(
        uint256 index,
        address seller,
        uint256 startPrice,
        string item,
        uint256 duration
    );
    event AuctionFinished(
        uint256 index,
        address buyer,
        uint256 endPrice,
        string item
    );

    Auction[] public auctions;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function rewardComission() external payable onlyOwner {
        require(address(this).balance > 0, "No money, no honey)");
        payable(owner).transfer(address(this).balance);
    }

    function createAuction(
        string memory _item,
        uint256 _startPrice,
        uint256 _duration,
        uint256 _sale
    ) public {
        require(msg.sender != owner, "Owner can't create auction");
        uint256 duration = _duration == 0 ? DURATION : _duration;
        require(_startPrice > duration * _sale, "Too cheap item");
        uint256 endTime = block.timestamp + duration;

        Auction memory auction = Auction({
            item: _item,
            startPrice: _startPrice,
            endPrice: _startPrice - _sale * duration,
            startTime: block.timestamp,
            endTime: endTime,
            duration: duration,
            finished: false,
            sale: _sale,
            seller: msg.sender
        });

        console.log("Start time when create auction: ", auction.startTime);

        auctions.push(auction);

        emit AuctionCreated(
            auctions.length - 1,
            msg.sender,
            _startPrice,
            _item,
            duration
        );
    }

    function getCurrentPrice(uint256 index) public view returns (uint256) {
        Auction memory auction = auctions[index];
        console.log("Auction: ", auction.item);
        console.log("current time: ", block.timestamp);
        console.log("start time: ", auction.startTime);
        return
            auction.startPrice -
            (block.timestamp - auction.startTime) *
            auction.sale;
    }

    function buyItem(uint256 index) public payable {
        uint256 currentPrice = getCurrentPrice(index);
        require(msg.value >= currentPrice, "You don't have enough money");
        Auction storage auction = auctions[index];
        require(auction.finished == false, "Finished!");
        require(msg.sender != auction.seller, "Seller can't buy item");
        auction.endPrice = currentPrice;
        auction.finished = true;
        auction.endTime = block.timestamp;
        payable(auction.seller).transfer(
            currentPrice - (currentPrice * FEE) / 100
        );
        payable(msg.sender).transfer(msg.value - currentPrice);
        emit AuctionFinished(index, msg.sender, currentPrice, auction.item);
    }
}
