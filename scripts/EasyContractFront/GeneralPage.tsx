import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { EasyContract__factory } from "../../typechain";

const easyContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const requestAccount = async () => {
  await (window as any)?.ethereum?.request({ method: "eth_requestAccounts" });
};

const getContract = async (tranzaction?: boolean) => {
  if (!(typeof (window as any).ethereum !== "undefined")) return;
  await requestAccount();
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  if (!tranzaction) {
    return getContractByProvider(provider);
  } else {
    return getContractBySigner(signer);
  }
};

const getContractByProvider = async (
  provider: ethers.providers.Web3Provider
) => {
  return await new ethers.Contract(
    easyContractAddress,
    EasyContract__factory.abi,
    provider
  );
};

const getContractBySigner = async (signer: ethers.providers.JsonRpcSigner) => {
  return await new ethers.Contract(
    easyContractAddress,
    EasyContract__factory.abi,
    signer
  );
};

export const GeneralPage = () => {
  const [value, setValue] = useState("0");
  const [easyContract, setEasyContract] = useState<ethers.Contract | undefined>(
    undefined
  );

  useEffect(() => {
    getContract()
      .then((contract) => {
        setEasyContract(contract);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    workingValue()
      .then(() => console.log(value))
      .catch((error) => console.log(error));
  }, [easyContract]);

  const plus = async (value: number) => {
    const contract = await getContract(true);
    await contract?.plus(value);
    setEasyContract(contract);
  };

  const minus = async (value: number) => {
    const contract = await getContract(true);
    await contract?.minus(value);
    setEasyContract(contract);
  };

  const multiple = async (value: number) => {
    const contract = await getContract(true);
    await contract?.multiple(value);
    setEasyContract(contract);
  };

  const divide = async (value: number) => {
    const contract = await getContract(true);
    await contract?.divide(value);
    setEasyContract(contract);
  };

  const workingValue = async () => {
    if (!easyContract) return;
    const workingValue = (await easyContract?.workingValue())?.toString();
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
