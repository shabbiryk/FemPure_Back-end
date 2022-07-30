const hre = require("hardhat");
const ethers = require("ethers")

async function main() {
	const [deployer] = await hre.ethers.getSigners();

	const contractName = await hre.ethers.getContractFactory(
		"FemPure"
	);
	const logisticsCost = ethers.utils.parseEther("0.4");
	const baseURI = "ipfs://bafybeibrbgx34glejbmk2cee7bqrd5wb77kwad4wwdg4sqhqbzu7ve5cdy/"
	const faucet = await contractName.deploy(logisticsCost, baseURI);

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
