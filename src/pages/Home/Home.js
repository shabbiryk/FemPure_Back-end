import React, { useState, useEffect } from "react";
import NavBar from '../../components/NavBar/NavBar'
import ProductCard from "../../components/ProductCard/ProductCard";
import {
	connectWallet,
	checkIfWalletIsConnected,
	getSignedContract,
	updateProviderAndContract,
} from "../../utils/common.js";
import {registerUser, isRegisteredUser, getProductDataFromIPFS, getAvailableLocations} from "../../utils/utility";
import FemPure from "../../abis/FemPure.json";
import FemPureContract from "../../abis/contract-address.json";
function Home ()  {
    const address = FemPureContract.FemPureContractAddr;
	const contractABI = FemPure.abi;
    useEffect(() => {

        getAvailableLocations(address, contractABI).then((res) => {console.log("Available Locations" + res)})
        getProductDataFromIPFS("ipfs://bafybeibrbgx34glejbmk2cee7bqrd5wb77kwad4wwdg4sqhqbzu7ve5cdy/0").then((res) => {console.log("productObj" + res.image, res.name, res.price)})

        
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
