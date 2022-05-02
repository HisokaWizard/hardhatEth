import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  BritishAuctionPlatform,
  BritishAuctionPlatform__factory,
} from "../typechain";

describe("BritishAuction", () => {
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let auction: BritishAuctionPlatform;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    auction = await new BritishAuctionPlatform__factory(owner).deploy();
    await auction.deployed();

    console.log(auction.address);

    await auction
      .connect(seller)
      .createAuction("Tree sword", ethers.utils.parseEther("0.001"), 100000);
  });

  it("Check that owner start contract", async () => {
    expect(await auction.owner()).to.eq(owner.address);
  });

  it("Check auction creation", async () => {
    expect((await auction.auctions(0)).item).to.eq("Tree sword");
    expect((await auction.auctions(0)).startPrice).to.eq(
      ethers.utils.parseEther("0.001")
    );
    expect((await auction.auctions(0)).duration).to.eq(100000);
  });

  it("Check setYouRate", async () => {
    const setRateTx = await auction
      .connect(buyer)
      .setYouRate(0, { value: ethers.utils.parseEther("0.002") });

    const swordAuc = await auction.auctions(0);
    const finalPrice = swordAuc.maxRate.rate;
    await expect(() => setRateTx).to.changeEtherBalance(
      buyer,
      -finalPrice.toNumber()
    );
  });
});
