import { ethers } from "hardhat";
import { PayContract__factory } from "../typechain";

async function main() {
  const [owner, vendor, customer] = await ethers.getSigners();
  console.log(owner.address);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const payContractVendorApi = await new ethers.Contract(
    contractAddress,
    PayContract__factory.abi,
    vendor
  );

  const payContractCustomerApi = await new ethers.Contract(
    contractAddress,
    PayContract__factory.abi,
    customer
  );

  console.log(await payContractVendorApi.contractPrice());
  console.log(await payContractCustomerApi.getAllContractsHash());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
