import React, { useState, useEffect } from "react";
import NavBar from '../../components/NavBar/NavBar'
import ProductCard from "../../components/ProductCard/ProductCard";
import {
	connectWallet,
	checkIfWalletIsConnected,
	getSignedContract,
	updateProviderAndContract,
} from "../../utils/common.js";
import {registerUser, isRegisteredUser, getAvailableProductsDetailsFromLocation} from "../../utils/utility";
import FemPure from "../../abis/FemPure.json";
import FemPureContract from "../../abis/contract-address.json";
function Home ()  {
    const address = FemPureContract.FemPureContractAddr;
	const contractABI = FemPure.abi;
    useEffect(() => {

        getAvailableProductsDetailsFromLocation(address, contractABI, "313001").then((res) => {console.log("Product Details",res)})
    }, [])


    return (<>
    {/* content */}
    <div style={{display: "flex", flexDirection:"row", flexFlow:"wrap"}}>
        <ProductCard 
            id="1" 
        />
        <ProductCard 
            id="2" 
        />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
    </div>
    </>)
}
export default Home;
