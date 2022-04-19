import { expect } from "chai";
import { ethers } from "hardhat";
import { PayContract__factory } from "../typechain";

describe("PayContract", function () {
  it("Base contract check without input", async function () {
    const [owner, vendor, customer] = await ethers.getSigners();

    console.log(vendor.address);

    const payContract = await new PayContract__factory(owner).deploy();
    expect(payContract.address).to.equal(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    expect(
      ethers.utils.formatEther(await payContract.contractPrice())
    ).to.equal("1.0");

    expect(await payContract.getAllContractsHash()).to.members([]);

    await payContract.connect(vendor).setVendor({
      contractContent:
        "Item: Flat. Address: Russia, Saint-Petersburg, Nevskiy avenue 100, 50. Action: sell",
      salePrice: 30,
      vendor: vendor.address,
    });

    const hash = (await payContract.getAllContractsHash())[0];

    expect((await payContract.getVendorContract(hash)).salePrice).to.equal(30);

    await payContract.connect(vendor).changeItemData(45, hash);

    expect((await payContract.getVendorContract(hash)).salePrice).to.equal(45);

    await payContract.connect(customer).makeSale(customer.address, hash, {
      value: ethers.utils.parseEther("46"),
    });

    expect((await payContract.getVendorContract(hash)).vendor).to.equal(
      customer.address
    );

    await payContract.connect(customer).changeItemData(35, hash);

    expect((await payContract.getVendorContract(hash)).salePrice).to.equal(35);

    await payContract
      .connect(vendor)
      .makeSale(vendor.address, hash, { value: ethers.utils.parseEther("36") });

    expect((await payContract.getVendorContract(hash)).vendor).to.equal(
      vendor.address
    );
  });
});
