import { ethers } from "ethers";
import { requestAccount, getSignedContract } from "./common";

// SmartContract function calls

export async function registerUser(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let transaction = await fempureContract.registerUser(400097,"some address");
        // let receipt = await transaction.wait();
        console.log(transaction);
      } catch (err) {
        console.log("error")
    }
    }
  }


  export async function isRegisteredUser(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let transaction = await fempureContract.isRegisteredUser();
        // let receipt = await transaction.wait();
        // console.log(transaction);
        return transaction
      } catch (err) {
        console.log("error", err)
    }
    }
  }