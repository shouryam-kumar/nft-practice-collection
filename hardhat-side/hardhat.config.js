require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const INFURA_NODE_URL = process.env.INFURA_NODE_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY



module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: INFURA_NODE_URL,
      accounts: [RINKEBY_PRIVATE_KEY]
    }
  }
};
