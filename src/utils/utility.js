import { ethers } from "ethers";
import ProductCard from "../components/ProductCard/ProductCard";
import { requestAccount, getSignedContract, getReadContract } from "./common";

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
  
      const fempureContract = getReadContract(contractAddr, artifact);
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
  
      const fempureContract = getReadContract(contractAddr, artifact);
        console.log(pincode)
        let productIDs = await fempureContract.getAvailableProductsInLocation(pincode);
        // let receipt = await transaction.wait();
        console.log("productIDs" + productIDs);
        return productIDs;

    }
  }

  export async function getProductDataFromIPFS(ipfs_uri) {

          let hashcode = ipfs_uri.split("ipfs://")[1]
          let web2metadatalink = "https://ipfs.io/ipfs/" + hashcode
          console.log("web2" + web2metadatalink)
          let response = await fetch(web2metadatalink)
          let obj = await response.json()
          const name = obj.name
          const priceInWei = obj.attributes[0].value
          let image_link = obj.image[0]
          hashcode = image_link.split("ipfs://")[1]
          web2metadatalink = "https://ipfs.io/ipfs/" + hashcode
          response = await fetch(web2metadatalink)
          let imageblob = await response.blob()
          var image = new Image();
          image.src = URL.createObjectURL(imageblob);  
          var object = {
            name:  name,
            image: image,
            price: priceInWei
          };
          // Return it
          return object;
    }


  export async function getAvailableLocations(contractAddr, artifact) {
    if (typeof window.ethereum != undefined) {
      await requestAccount();
  
      const fempureContract = getReadContract(contractAddr, artifact);
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
