import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  G1Token,
  G1Token__factory,
  G2Token,
  G2Token__factory,
} from "../typechain";

describe("SwapContract", () => {
  let tonyaTokenContract: G1Token;
  let pupaTokenContract: G2Token;

  beforeEach(async () => {
    const [owner, user] = await ethers.getSigners();
    const tonyaTokenFactory = await new G1Token__factory(owner).deploy();
    tonyaTokenContract = await tonyaTokenFactory.deployed();
    console.log(tonyaTokenContract.address);
    const pupaTokenFactory = await new G2Token__factory(owner).deploy();
    pupaTokenContract = await pupaTokenFactory.deployed();
    console.log(pupaTokenContract.address);

    tonyaTokenContract.connect(owner).transfer(owner.address, 9000000);
    pupaTokenContract.connect(owner).transfer(owner.address, 9000000);
    tonyaTokenContract.connect(owner).transfer(user.address, 1000);
    pupaTokenContract.connect(owner).transfer(user.address, 5000);
  });

  const swapPupaToTonya = async (user: SignerWithAddress, amount: number) => {
    const pupaAm = await pupaTokenContract.balanceOf(user.address);
    if (pupaAm.toNumber() > amount) {
      return console.log("You dont have money goldfinch!!");
    }
    const [owner] = await ethers.getSigners();
    console.log("owner address:", owner.address);
    await pupaTokenContract.connect(user).transfer(owner.address, amount, {
      gasLimit: BigNumber.from(1000000),
    });
    await tonyaTokenContract.connect(owner).transfer(user.address, amount, {
      gasLimit: BigNumber.from(1000000),
    });
    const pupaUserAmount = await pupaTokenContract.balanceOf(user.address);
    const tonyaUserAmount = await tonyaTokenContract.balanceOf(user.address);
    console.log(
      `User has: TNT: ${tonyaUserAmount.toNumber()} and PUT: ${pupaUserAmount.toNumber()}`
    );
  };

  it("Swap pupa to tonya", async () => {
    const [, user] = await ethers.getSigners();
    console.log("user address:", user.address);
    await swapPupaToTonya(user, 2000);
  });
});
