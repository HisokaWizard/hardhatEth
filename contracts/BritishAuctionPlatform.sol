//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract BritishAuctionPlatform {
    struct Rate {
        address buyer;
        uint256 rate;
    }
    struct Auction {
        string item;
        uint256 startPrice;
        Rate maxRate;
        uint256 startTime;
        uint256 endTime;
        uint256 duration;
        address seller;
        bool finished;
    }

    address public owner;
    uint8 private constant FEE = 5;
    uint32 private constant DURATION = 5 days;
    Auction[] public auctions;

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
        uint256 _duration
    ) public {
        require(msg.sender != owner, "Owner can't create auction");
        uint256 duration = _duration == 0 ? DURATION : _duration;
        uint256 endTime = block.timestamp + duration;

        Rate memory maxRate = Rate({buyer: address(0), rate: _startPrice});

        Auction memory auction = Auction({
            item: _item,
            startPrice: _startPrice,
            startTime: block.timestamp,
            maxRate: maxRate,
            endTime: endTime,
            duration: duration,
            finished: false,
            seller: msg.sender
        });

        auctions.push(auction);

        emit AuctionCreated(
            auctions.length - 1,
            msg.sender,
            _startPrice,
            _item,
            duration
        );
    }

    function setYouRate(uint256 index) public payable {
        Auction storage auction = auctions[index];
        require(
            auction.startPrice < msg.value,
            "You rate less than start price"
        );
        require(auction.maxRate.rate < msg.value, "You rate don't maximum");
        Rate memory maxRate = Rate({buyer: msg.sender, rate: msg.value});
        if (auction.maxRate.buyer != address(0) && auction.maxRate.rate > 0) {
            payable(auction.maxRate.buyer).transfer(auction.maxRate.rate);
        }
        auction.maxRate = maxRate;
    }

    function auctionFinish(uint256 index) public payable onlyOwner {
        Auction storage auction = auctions[index];
        require(auction.maxRate.buyer != address(0), "No buyer, no money");
        auction.finished = true;
        payable(auction.seller).transfer(
            auction.maxRate.rate - (auction.maxRate.rate * FEE) / 100
        );
    }
}
