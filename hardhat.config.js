require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    // 执行命令：npx hardhat run scripts/deploy.js --network sepolia 会使用这个配置
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, //你的服务节点地址
      accounts: [process.env.PRIVATE_KEY] // 你的真实钱包账号私钥
    }
  }
};
