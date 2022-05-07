import { ethers } from "hardhat";
import { EasyContract__factory } from "../../typechain";

async function main() {
  const [owner] = await ethers.getSigners();

  const easyContract = await new EasyContract__factory(owner).deploy();
  await easyContract.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
