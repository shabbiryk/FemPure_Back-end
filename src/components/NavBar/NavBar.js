import React, { useState, useEffect } from "react";
import { FaShoppingBasket, FaShoppingBag } from 'react-icons/fa';
import {
	connectWallet,
	checkIfWalletIsConnected,
	getSignedContract,
	updateProviderAndContract,
} from "../../utils/common.js";
import {registerUser, isRegisteredUser} from "../../utils/utility"
import './NavBar.css'
import FemPure from "../../abis/FemPure.json";
import FemPureContract from "../../abis/contract-address.json";

function NavBar(props) {
    
	const [contractOwner, setContractOwner] = useState("");
	// const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));
	const [provider, setProvider] = useState(null);
	const [contract, setContract] = useState(null);

	const address = FemPureContract.FemPureContractAddr;
	const contractABI = FemPure.abi;


	useEffect(() => {
		checkIfWalletIsConnected(props.setCurrentAccount);
		updateProviderAndContract(address, contractABI, setProvider, setContract);
	}, []);

	// useEffect(() => {
	// 	if (props.currentAccount)
	// 		getContractOwner(setContractOwner);
	// }, [props.currentAccount]);

	function signOut() {
		props.setCurrentAccount("");
		localStorage.removeItem("currentAccount")
	}

	function SignIn(){
		connectWallet(props.setCurrentAccount)
		isRegisteredUser(address, contractABI)
	}
    return (
        <div className="header">
			<img src="./FemPureLogo.png" height={100} width={100} style={{float:"left", marginBottom:10}}/>
            {!props.currentAccount && 
				<button onClick={() => SignIn()}>Sign In</button>
			} 
			{props.currentAccount && 
				(<div style={{float:"right", paddingRight:10}}>
					<FaShoppingBag size={45}/>
					<button style={{fontSize:30}} onClick={() => signOut()}>Sign Out</button>
				</div>)
			}
        </div>
    )
}
export default NavBar;
