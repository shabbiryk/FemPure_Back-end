import { ethers } from "ethers";
import { requestAccount, getSignedContract } from "./common";

// SmartContract function calls

export async function registerUser(contractAddr, artifact, pincode, residenceAddress) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let transaction = await fempureContract.registerUser(pincode, residenceAddress);
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
        let response = await fempureContract.isRegisteredUser();
        // let receipt = await transaction.wait();
        console.log(response);
        return response;
      } catch (err) {
        console.log("error", err)
    }
    }
  }

  export async function registerPartner(contractAddr, artifact, pincodes) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let transaction = await fempureContract.registerPartner(pincodes);
        // let receipt = await transaction.wait();
        console.log(transaction);
      } catch (err) {
        console.log("error")
    }
    }
  }

  export async function isRegisteredPartner(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let response = await fempureContract.isRegisteredPartner();
        // let receipt = await transaction.wait();
        console.log(response);
        return response;
      } catch (err) {
        console.log("error", err)
    }
    }
  }

  export async function productMetadataURI(contractAddr, artifact, productID) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let ipfs_uri = await fempureContract.productMetadataURI(productID);
        // let receipt = await transaction.wait();
        console.log(ipfs_uri);
        return ipfs_uri;
      } catch (err) {
        console.log("error")
    }
    }
  }

  export async function getAvailableProductsInLocation(contractAddr, artifact, pincode) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let productIDs = await fempureContract.getAvailableProductsInLocation(pincode);
        // let receipt = await transaction.wait();
        console.log(productIDs);
        return productIDs;
      } catch (err) {
        console.log("error")
    }
    }
  }

  export async function getAvailableLocations(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getSignedContract(contractAddr, artifact);
      try {
        let pincodes = await fempureContract.getAvailableLocations();
        // let receipt = await transaction.wait();
        console.log(pincodes);
        return pincodes;
      } catch (err) {
        console.log("error")
    }
    }
  }
