'use client'
import { createContext, useEffect, useContext, useState } from "react";
import StakingRewards from "../../artifacts/contracts/StakingRewards.sol/StakingRewards.json";
import STK from "../../artifacts/contracts/MockToken.sol/MockToken.json";
import RTK from "../../artifacts/contracts/MockToken.sol/MockToken.json";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from "ethers";

const StakingRewardsContext = createContext();
const contractAddress = process.env.NEXT_PUBLIC_STAKING_REWARDS_CONTRACT;

const stkAddress = process.env.NEXT_PUBLIC_STAKING_TOKEN_ADDRESS;
const rtkAddress = process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS;

export default function StakingRewardsProvider({ children }) {
    const { provider, account } = useWeb3React();
    const [contract, setContract] = useState(null);
    const [stk, setStk] = useState(null);
    const [rtk, setRtk] = useState(null);
    useEffect(() => {
        if (!provider) return;
        const signer = provider.getSigner();
        const contract = new Contract(contractAddress, StakingRewards.abi, signer);
        const stk = new Contract(stkAddress, STK.abi, signer);
        const rtk = new Contract(rtkAddress, RTK.abi, signer);
        setContract(contract);
        setStk(stk);
        setRtk(rtk);
    }, [provider]);
    const amount = parseUnits('1', 'ether');

    const mintSTK = async () => {
        console.log('mint STK', account, amount);
        await stk.mint(account, amount);
        // await stk.mint(account, amount);
    }
    const addSTK = async () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: stkAddress,
                        symbol: 'STK',
                        decimals: 18,
                        // image: 'https://placekitten.com/200/300',
                    },
                },
            })
        }
    }
    const addRTK = async () => {
        if (window.ethereum) {
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rtkAddress,
                        symbol: 'RTK',
                        decimals: 18,
                        // image: 'https://placekitten.com/200/300',
                    },
                },
            })
        }
    }

    const queryBalance = async () => {
        console.log('query balance', account);
        const stkBalance = await stk.balanceOf(account);
        const rtkBalance = await rtk.balanceOf(account);
        console.log('STK balance:', stkBalance.toString());
        console.log('RTK balance:', rtkBalance.toString());
    }

    const stakeSTK = async () => {
        console.log('stake STK', amount);
        await stk.approve(contract.address, amount);
        await contract.stake(amount)
    }
    const withdrawRTK = async () => {
        console.log('withdraw RTK', amount);
        await contract.withdraw(amount)
    }

    return (
        <StakingRewardsContext.Provider value={{
            contract,
            stk,
            rtk,
            mintSTK,
            stakeSTK,
            withdrawRTK,
            addSTK,
            addRTK,
            queryBalance
        }}>
            {children}
        </StakingRewardsContext.Provider>
    );
}

export function useStakingRewardsContext() {
    return useContext(StakingRewardsContext);
}