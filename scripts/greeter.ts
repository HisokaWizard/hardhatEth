import { ethers } from 'hardhat';

async function main() {
  const greeterFactory = await ethers.getContractFactory('Greeter');

  const greeter = await greeterFactory.deploy('Hello, Petr!!');

  console.log(greeter);

  console.log('Greeter deployed to:', greeter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
