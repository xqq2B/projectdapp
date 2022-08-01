require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: '.env' });

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/wPXcZh3H7xyX3A02SafC-CnLtvDPU4Va',
      accounts: ['73431a4927a9d31fde19a8d2532c73696d926462381c618ee126da0fa34caed4'],
      gasPrice: 8000000000,
    },
  },
};
