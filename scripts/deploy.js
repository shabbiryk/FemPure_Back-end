const hre = require("hardhat");

async function main() {
	const [deployer] = await hre.ethers.getSigners();

	const contractName = await hre.ethers.getContractFactory(
		"contractName"
	);
	const faucet = await contractName.deploy();

	await faucet.deployed();
	console.log(`contractName deployed to address: ${faucet.address}`);

	saveFrontendFiles(faucet);
}

function saveFrontendFiles(contract) {
	const fs = require("fs");
	const contractsDir = __dirname + "/../src/abis";

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir);
	}

	fs.writeFileSync(
		contractsDir + "/contract-address.json",
		JSON.stringify({ FaucetContractAddr: contract.address }, undefined, 2)
	);

	const FaucetArtifact = artifacts.readArtifactSync("contractName");

	fs.writeFileSync(
		contractsDir + "/contractName.json",
		JSON.stringify(FaucetArtifact, null, 2)
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
