import { expect } from "chai";
import { ethers } from "hardhat";
import { EasyContract } from "../typechain/EasyContract";
import { EasyContract__factory } from "../typechain/factories/EasyContract__factory";

describe("EasyContract", () => {
  let easyContract: EasyContract;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const easyContractFactory = await new EasyContract__factory(owner).deploy();
    easyContract = await easyContractFactory.deployed();
    console.log(easyContract.address);
  });

  it("Check plus method", async () => {
    const tx = await easyContract.plus(100);

    expect(await easyContract.workingValue()).to.eq(100);
    expect(tx).to.emit(easyContract, "wasPlus").withArgs(100);
  });

  it("Check minus method", async () => {
    const tx = await easyContract.plus(100);
    await easyContract.minus(75);

    expect(await easyContract.workingValue()).to.eq(25);
    expect(tx).to.emit(easyContract, "wasMinus").withArgs(25);
  });

  it("Check multiple method", async () => {
    const tx = await easyContract.plus(100);
    await easyContract.multiple(10);

    expect(await easyContract.workingValue()).to.eq(1000);
    expect(tx).to.emit(easyContract, "wasMultiple").withArgs(1000);
  });

  it("Check divide method", async () => {
    const tx = await easyContract.plus(100);
    await easyContract.divide(10);

    expect(await easyContract.workingValue()).to.eq(10);
    expect(tx).to.emit(easyContract, "wasDivide").withArgs(10);
  });
});
