import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  NetherLandsAuctionPlatform,
  NetherLandsAuctionPlatform__factory,
} from "../typechain";

describe("NetherlandsAuction", () => {
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let auction: NetherLandsAuctionPlatform;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    auction = await new NetherLandsAuctionPlatform__factory(owner).deploy();
    await auction.deployed();

    console.log(auction.address);

    await auction
      .connect(seller)
      .createAuction(
        "Diamond sword",
        ethers.utils.parseEther("0.001"),
        500000,
        10
      );
  });

  it("Check that owner start contract", async () => {
    expect(await auction.owner()).to.eq(owner.address);
  });

  it("Check auction creation", async () => {
    expect((await auction.auctions(0)).item).to.eq("Diamond sword");
    expect((await auction.auctions(0)).startPrice).to.eq(
      ethers.utils.parseEther("0.001")
    );
    expect((await auction.auctions(0)).duration).to.eq(500000);
    expect((await auction.auctions(0)).sale).to.eq(10);
  });

  const sleep = async (wait: number) => {
    return new Promise((resolve) => setTimeout(resolve, wait));
  };

  it("allows to buy", async () => {
    await sleep(5000);

    const buyTx = await auction
      .connect(buyer)
      .buyItem(0, { value: ethers.utils.parseEther("0.001") });

    const swordAuc = await auction.auctions(0);
    const finalPrice = swordAuc.endPrice;
    await expect(() => buyTx).to.changeEtherBalance(
      seller,
      finalPrice.toNumber() - Math.floor((finalPrice.toNumber() * 5) / 100)
    );

    await expect(buyTx)
      .to.emit(auction, "AuctionFinished")
      .withArgs(0, buyer.address, finalPrice, "Diamond sword");

    await expect(
      auction
        .connect(buyer)
        .buyItem(0, { value: ethers.utils.parseEther("0.001") })
    ).to.be.revertedWith("Finished!");
  });
});
