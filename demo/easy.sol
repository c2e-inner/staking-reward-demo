// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// 算法
contract StakingRewards {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    uint256 public totalShares; // 系统的总份额
    uint256 public totalStaked; // 系统的总质押金额

    mapping(address => uint256) public userShares; // 每个用户的份额
    mapping(address => uint256) public userStaked; // 每个用户的质押金额

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    // 用户质押函数
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        // 如果总份额为0，说明是第一个用户，直接分配份额
        if (totalShares == 0) {
            userShares[msg.sender] = amount;
            totalShares = amount;
        } else {
            // 如果已经有用户质押，按照比例分配份额
            uint256 share = (amount * totalShares) / totalStaked;
            userShares[msg.sender] += share;
            totalShares += share;
        }

        userStaked[msg.sender] += amount;
        totalStaked += amount;

        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    // 计算用户的可领取奖励
    function calculateReward(address user) public view returns (uint256) {
        // 根据用户的份额占比，计算其可领取的奖励
        uint256 userSharePercentage = (userShares[user] * 1e18) / totalShares;
        uint256 rewardAmount = (rewardToken.balanceOf(address(this)) * userSharePercentage) / 1e18;
        return rewardAmount;
    }

    // 用户提取质押和奖励
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(userStaked[msg.sender] >= amount, "Insufficient staked amount");

        uint256 share = (amount * totalShares) / totalStaked;
        totalShares -= share;
        userShares[msg.sender] -= share;

        userStaked[msg.sender] -= amount;
        totalStaked -= amount;

        // 发放奖励
        uint256 reward = calculateReward(msg.sender);
        rewardToken.transfer(msg.sender, reward);

        // 归还质押
        stakingToken.transfer(msg.sender, amount);
    }
}