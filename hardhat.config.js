require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
// const {infuraProjectId, privateKey, etherscanAPIkey} = require('./secrets.json');
const infuraProjectId = process.env.INFURA_API_KEY
const privateKey = process.env.WALLET_PRIVATE_KEY
const polycanAPIkey = process.env.ETHERSCAN_API_KEY

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {

  networks: {
	mumbai: {
		url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
		accounts: [privateKey],
	  }
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: polyscanAPIkey
  },
  solidity: {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
};
