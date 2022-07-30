import React, { useState, useEffect } from "react";
import {  AiOutlineShoppingCart } from 'react-icons/ai';
import { GiCircle } from "react-icons/gi"
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
	const [showModal, setShowModal] = useState(true)
    
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
				<button className="signIn" onClick={() => SignIn()}>Sign In</button>
			} 
			{props.currentAccount && 
				(<div style={{float:"right", paddingRight:10}}>
				  <div className="GiCircle">
				  <GiCircle  size={35}/>
				  </div>
					<div className="Fabag">
					<AiOutlineShoppingCart size={45}/>
					</div>
					<button className="signOut" onClick={() => signOut()}>Sign Out</button>
				</div>)
			}
			{showModal? <div className="overlay">
				<div className="mod">
					<div className="title">
						Hello
					</div>
					<div className="user__info">
						<label>Pincode

						<input type="text"></input>
						</label>
						<label>Address
						<input type="text"></input>
						</label>
					</div>
					<button className="button">Sign Up</button>
				</div>
			</div> : <></>}
        </div>
		
    )
}
export default NavBar;
