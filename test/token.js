const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Staking Rewards", function () {
  async function deployToken(name, symbol, initialSupply) {

    const Token = await ethers.getContractFactory("MockToken");
    const token = await Token.deploy(name, symbol, initialSupply);

    return token;
  }

  describe("should deploy token", function () {
    it("should deploy staking token", async function () {
      const initialSupply = ethers.parseUnits('100', 'ether');
      const stk = await deployToken('Staking Token', 'STK', initialSupply);
      expect(stk.target).to.be.properAddress;
    });

    it("should deploy reward token", async function () {
      const initialSupply = ethers.parseUnits('100', 'ether');
      const rtk = await deployToken('Reward Token', 'RTK', initialSupply);
      expect(rtk.target).to.be.properAddress;
    });
  });

  describe("should deploy staking rewards", function () {

    this.beforeEach(async function () {
      const initialSupply = ethers.parseUnits('100', 'ether');
      this.stk = await deployToken('Staking Token', 'STK', initialSupply);
      this.rtk = await deployToken('Reward Token', 'RTK', initialSupply);
    });
    it("should deploy staking rewards", async function () {
      const rewardSupply = ethers.parseUnits('100', 'ether');
      const StakingRewards = await ethers.getContractFactory("StakingRewards");
      const stakingRewards = await StakingRewards.deploy(this.stk.target, this.rtk.target, rewardSupply);
      expect(stakingRewards.target).to.be.properAddress;
    });

    it("should emit Staked event when staked", async function () {
      const rewardSupply = ethers.parseUnits('100', 'ether');
      const StakingRewards = await ethers.getContractFactory("StakingRewards");
      const stakingRewards = await StakingRewards.deploy(this.stk.target, this.rtk.target, rewardSupply);
      const [owner] = await ethers.getSigners();
      const amount = ethers.parseUnits('10', 'ether');
      await this.stk.connect(owner).approve(stakingRewards.target, amount);
      await expect(stakingRewards.connect(owner).stake(amount))
        .to.emit(stakingRewards, 'Staked')
        .withArgs(owner.address, amount);
    });

    it("should emit Withdrawn event when withdrawn", async function () {
      const rewardSupply = ethers.parseUnits('100', 'ether');
      const StakingRewards = await ethers.getContractFactory("StakingRewards");
      const stakingRewards = await StakingRewards.deploy(this.stk.target, this.rtk.target, rewardSupply);
      const [owner] = await ethers.getSigners();
      const amount = ethers.parseUnits('10', 'ether');
      await this.stk.connect(owner).approve(stakingRewards.target, amount);
      await stakingRewards.connect(owner).stake(amount);
      await expect(stakingRewards.connect(owner).withdraw(amount))
        .to.emit(stakingRewards, 'Withdrawn')
        .withArgs(owner.address, amount);
    });
  });
});
