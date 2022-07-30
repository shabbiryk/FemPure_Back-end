import React, { useState, useEffect } from "react";
import {
	connectWallet,
	checkIfWalletIsConnected,
	getSignedContract,
	updateProviderAndContract,
} from "../../utils/common.js";

import './NavBar.css'


function NavBar(props) {
    
	const [contractOwner, setContractOwner] = useState("");
	// const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));
	const [provider, setProvider] = useState(null);
	const [contract, setContract] = useState(null);

	// const address = addressJson.address;
	// const contractABI = abiJson.abi;

	useEffect(() => {
		checkIfWalletIsConnected(props.setCurrentAccount);
		// updateProviderAndContract(address, contractABI, setProvider, setContract);
	}, []);

	// useEffect(() => {
	// 	if (props.currentAccount)
	// 		getContractOwner(setContractOwner);
	// }, [props.currentAccount]);

	function signOut() {
		props.setCurrentAccount("");
		localStorage.removeItem("currentAccount")
	}

    return (
        <div className="header">
            {!props.currentAccount && 
				<button onClick={() => connectWallet(props.setCurrentAccount)}>Sign In</button>
			} 
			{props.currentAccount && 
				<button onClick={() => signOut()}>Sign Out</button>
			}
        </div>
    )
}
export default NavBar;
