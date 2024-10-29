// SPDX-License-Identifier: MIT
// 算法 + 时间
pragma solidity ^0.8.0;

contract StakingRewards {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    uint256 public totalShares; // 系统的总份额
    uint256 public totalStaked; // 系统的总质押金额

    mapping(address => uint256) public userShares;  // 用户当前的份额
    mapping(address => uint256) public userStaked;  // 用户质押的金额
    mapping(address => uint256) public userLastUpdateTime; // 用户上次质押或领取的时间
    mapping(address => uint256) public userAccumulatedTime; // 累积的质押时间，用于增加份额

    uint256 public constant REWARD_RATE = 1000; // 假设的增长速率（可以根据需求调整）

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    // 计算用户的时间加成份额
    function _updateUserShares(address user) internal {
        uint256 timeSinceLastUpdate = block.timestamp - userLastUpdateTime[user];
        if (timeSinceLastUpdate > 0 && userStaked[user] > 0) {
            // 根据时间增长份额，REWARD_RATE 代表每秒的增长率
            uint256 additionalShares = (userStaked[user] * timeSinceLastUpdate * REWARD_RATE) / 1e18;
            userShares[user] += additionalShares;
            totalShares += additionalShares;
        }
        userLastUpdateTime[user] = block.timestamp;
    }

    // 用户质押函数
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        // 更新用户的份额，以增加时间相关的增长
        _updateUserShares(msg.sender);

        // 如果系统中已有份额，根据当前质押比例分配新份额
        if (totalShares == 0) {
            userShares[msg.sender] = amount;
            totalShares = amount;
        } else {
            uint256 share = (amount * totalShares) / totalStaked;
            userShares[msg.sender] += share;
            totalShares += share;
        }

        userStaked[msg.sender] += amount;
        totalStaked += amount;

        // 更新用户质押的时间
        userLastUpdateTime[msg.sender] = block.timestamp;

        // 传输质押的代币
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }

    // 计算用户的可领取奖励
    function calculateReward(address user) public view returns (uint256) {
        uint256 userSharePercentage = (userShares[user] * 1e18) / totalShares;
        uint256 rewardAmount = (rewardToken.balanceOf(address(this)) * userSharePercentage) / 1e18;
        return rewardAmount;
    }

    // 用户提取质押和奖励
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(userStaked[msg.sender] >= amount, "Insufficient staked amount");

        // 更新用户的份额，以增加时间相关的增长
        _updateUserShares(msg.sender);

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
