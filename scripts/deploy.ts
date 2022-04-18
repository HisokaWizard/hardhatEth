import { ethers } from "hardhat";
import { PayContract__factory } from "../typechain";

async function main() {
  const [owner] = await ethers.getSigners();

  const payContract = await new PayContract__factory(owner).deploy();
  console.log(payContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
