import { expect } from "chai";
import { ethers } from "hardhat";
import { PayContract__factory } from "../typechain";

describe("PayContract", function () {
  it("Base contract check without input", async function () {
    const [owner] = await ethers.getSigners();

    const payContract = await new PayContract__factory(owner).deploy();
    expect(payContract.address).to.equal(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    expect(
      ethers.utils.formatEther(await payContract.contractPrice())
    ).to.equal("1.0");

    expect(await payContract.getAllContractsHash()).to.members([]);
  });
});
