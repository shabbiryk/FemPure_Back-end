import React, { useState, useEffect } from "react";
import { Route, Routes, Redirect, BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Home from './pages/Home/Home'
 import NavBar from './components/NavBar/NavBar'

function App() {
	const [currentAccount, setCurrentAccount] = useState(localStorage.getItem("currentAccount"));
	
	return ( 
	<>
	<NavBar currentAccount={currentAccount} setCurrentAccount={setCurrentAccount}/>
		<Router>
			<Routes>
				<Route path="/" element={<Home />}>
				</Route>
			</Routes>
		</Router>
	</>
	);
}

export default App;
