import React, { useState, useEffect } from "react";
import { Route, Routes, Redirect, BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Home from './pages/Home/Home'
 import NavBar from './components/NavBar/NavBar'
import Cart from "./pages/Cart/Cart";

function App() {
	const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));
	
	return ( 
	<>
	<NavBar currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
	<div style={{padding:18}}>
		<Router>
			<Routes>
				<Route path="/" element={<Home />}>
				</Route>
				<Route path="/cart" element={<Cart />}>
				</Route>
			</Routes>
		</Router>
	</div>
	</>
	);
}

export default App;
