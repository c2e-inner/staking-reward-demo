# 黑客松质押收益项目案例

## demo项目
#### 合约地址（demo只支持了ethereum sepolia）
ethereum sepolia链合约地址

Staking Token: 0x1b7a4682ab1dAdaC75775a936E12460920C708CD

Reward Token 0x4aaaE6ee7e39DFfE02f6051209A3b5e05a015595

StakingRewards: 0x33b13552d8a0AFcF9D9fa42022CBB7Babc24a0FB

#### subgraph
项目将StakingRewards部署到了theGraph上，可以通过以下graphQL请求查询合约log日志
```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ stakeds(first: 5) { id user amount blockNumber } withdrawns(first: 5) { id user amount blockNumber } }", "operationName": "Subgraphs", "variables": {}}' \
  https://api.studio.thegraph.com/query/92435/stakingrewards/version/latest
```

## 概述
案例使用demo中的easy版本StakingRewards.sol，提供一个实现方向，同学可以自己发挥创造力做项目或者在该项目上迭代更多功能
推荐的组队配置：合约、前端、服务端
- 合约
    - 合约逻辑实现
    - 各类标准引用、参考
    - 合约单测
    - 合约部署
    - 合约升级：可选，如果有余力完善的话【建议参考EIP2535钻石合约】
- 前端
    - 钱包调用
    - 合约调用
    - 前端ui
    - demo项目前端只做了单个网络的工作，同学可以扩展多个网络【网络切换后不同网络的合约切换】
- 服务端（后端）
    - 数据存储【可选方案很多，可以使用subgraph】
    - 后台服务支撑【如果项目涉及一些较复杂的模块，比如链下验签，链下数据处理等，比如有想法的同学可以对接ai服务】

## 合约部分

### 安装依赖
`npm install` or `yarn install`

### 单元测试
`npx hardhat test`

### 本地部署
- 启动本地链
    `npx hardhat node`
- 部署合约
    `npx hardhat run ./script/deploy.js`
- 本地初次部署地址会在控制台log
```javascript
Staking Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Reward Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
StakingRewards deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## 前端部分

![](./image.png)

路径：`./front`

进入前端文件工程，`cd front`

### 安装依赖

`yarn install`，前端yarn安装的环境比npm更稳定

### 环境配置说明

将`.env.local.example`的`.example`去掉

即.env文件：

```
## 质押收益合约地址
NEXT_PUBLIC_STAKING_REWARDS_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

## 质押代币地址
NEXT_PUBLIC_STAKING_TOKEN_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3

## 收益代币地址
NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512


```

### 启动前台项目

`npm run dev`

## 部署到生产环境

### 合约

- 到alchemy或者infra注册账号，申请apikey
- 请自行阅读hardhat部署文档将项目部署到测试链
[合约部署文档](https://hardhat.org/tutorial/deploying-to-a-live-network#_7-deploying-to-a-live-network)

hardhat config配置
```javascript
module.exports = {
  solidity: "0.8.27",
  // networks:{
  // // 执行命令：npx hardhat run scripts/deploy.js --network sepolia 会使用这个配置
  // sepolia:{
  //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, //你的服务节点地址
  //   accounts: [process.env.PRIVATE_KEY] // 你的真实钱包账号私钥
  // }
  // }
};
```

`.env.example`去掉`.example`，设置自己的私钥和apikey

```
PRIVATE_KEY=0x...
ALCHEMY_API_KEY=...
```

### 前端

- 推荐使用vercel将nextjs项目部署到生产环境，需要链接github仓库，请自行阅读部署文档
[vercel文档](https://vercel.com/docs)
- 如果同学有自己的部署方式，提供您的项目访问链接即可

### 后端

后端提供两个方向参考，做数据存储或链下验签

- subgraph [theGraph](https://thegraph.com/docs/zh/quick-start/)可以使用子图服务做数据存储
- geth，使用geth监听链上事件，存储到数据库





