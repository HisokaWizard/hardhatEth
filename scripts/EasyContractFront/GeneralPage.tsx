import { ethers } from "ethers";
import React, { useState } from "react";
import { EasyContract__factory } from "../../typechain";

const easyContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const onwerAddress =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const getContract = async () => {
  if (!(typeof (window as any).ethereum !== "undefined")) return;
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const walletSigner = new ethers.Wallet(onwerAddress, provider);
  const contract = await new ethers.Contract(
    easyContractAddress,
    EasyContract__factory.abi,
    walletSigner
  );
  return contract;
};

export const GeneralPage = () => {
  const [value, setValue] = useState("0");
  const contract = getContract();

  const plus = async (value: number) => {
    await (await contract)?.plus(value);
    await workingValue();
  };

  const minus = async (value: number) => {
    await (await contract)?.minus(value);
    await workingValue();
  };

  const multiple = async (value: number) => {
    await (await contract)?.multiple(value);
    await workingValue();
  };

  const divide = async (value: number) => {
    await (await contract)?.divide(value);
    await workingValue();
  };

  const workingValue = async () => {
    const workingValue = (await (await contract)?.workingValue()).toString();
    setValue(workingValue);
  };

  return (
    <div>
      <div>General page! {easyContractAddress}</div>
      <button onClick={() => plus(100)}>Plus +</button>
      <button onClick={() => minus(10)}>Minus -</button>
      <button onClick={() => multiple(2)}>Multiple *</button>
      <button onClick={() => divide(5)}>Divide /</button>
      <div>Working value: {value}</div>
    </div>
  );
};
