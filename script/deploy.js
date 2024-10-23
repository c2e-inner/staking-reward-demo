const hre = require("hardhat");
async function deployToken(name, symbol, initialSupply) {
    const Token = await hre.ethers.getContractFactory("MockToken");
    const token = await Token.deploy(name, symbol, initialSupply);

    return token;
}
async function deploy() {
    /**
     * Deploy Staking Token and Reward Token
     */
    const initialSupply = ethers.parseUnits('100', 'ether');
    const stk = await deployToken('Staking Token', 'STK', initialSupply);
    const rtk = await deployToken('Reward Token', 'RTK', initialSupply);
    await stk.waitForDeployment();
    await rtk.waitForDeployment();

    console.log(`Staking Token deployed to: ${stk.target}`);
    console.log(`Reward Token deployed to: ${rtk.target}`);

    /**
     * Deploy StakingRewards contract
     */
    const rewardSupply = ethers.parseUnits('100', 'ether');
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    const stakingRewards = await StakingRewards.deploy(stk.target, rtk.target, rewardSupply);
    await stakingRewards.waitForDeployment();
    console.log(`StakingRewards deployed to: ${stakingRewards.target}`);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });