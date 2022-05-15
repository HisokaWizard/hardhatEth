import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { EasyContract__factory } from "../../typechain";

const easyContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const _window = window as any;

const requestAccount = async () => {
  await _window?.ethereum?.request({ method: "eth_requestAccounts" });
};

const getContract = async (tranzaction?: boolean) => {
  if (!(typeof _window?.ethereum !== "undefined")) return;
  await requestAccount();
  const provider = new ethers.providers.Web3Provider(_window?.ethereum);
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
  const [inputValue, setInputValue] = useState(1);
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

  // Functionality works, but expectation is not ordinary - will reseach it
  // easyContract?.on("wasPlus", (value: ethers.BigNumber) => {
  //   console.log("wasPlus", value.toString());
  // });

  // easyContract?.on("wasMinus", (value: ethers.BigNumber) => {
  //   console.log("wasMinus", value.toString());
  // });

  // easyContract?.on("wasMultiple", (value: ethers.BigNumber) => {
  //   console.log("wasMultiple", value.toString());
  // });

  // easyContract?.on("wasDivide", (value: ethers.BigNumber) => {
  //   console.log("wasDivide", value.toString());
  // });

  const plus = async (value: number) => {
    const contract = await getContract(true);
    const tx = await contract?.plus(value);
    await tx.wait();
    setEasyContract(contract);
  };

  const minus = async (value: number) => {
    const contract = await getContract(true);
    const tx = await contract?.minus(value);
    await tx.wait();
    setEasyContract(contract);
  };

  const multiple = async (value: number) => {
    const contract = await getContract(true);
    const tx = await contract?.multiple(value);
    await tx.wait();
    setEasyContract(contract);
  };

  const divide = async (value: number) => {
    const contract = await getContract(true);
    const tx = await contract?.divide(value);
    await tx.wait();
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
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(+e.target.value)}
      />
      <button onClick={() => plus(inputValue)}>Plus +</button>
      <button onClick={() => minus(inputValue)}>Minus -</button>
      <button onClick={() => multiple(inputValue)}>Multiple *</button>
      <button onClick={() => divide(inputValue)}>Divide /</button>
      <div>Working value: {value}</div>
    </div>
  );
};
