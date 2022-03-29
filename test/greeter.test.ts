import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Greeter', () => {
  it("Should return the new greeting once it's changed", async () => {
    const greeterFactory = await ethers.getContractFactory('Greeter');

    expect(await greeterFactory.deploy('Hello, Petr!!')).to.eq('Hello, world!');

    const greeter = await greeterFactory.deploy('Hola, mundo!');

    expect(await greeter).to.equal('Hola, mundo!');
  });
});
