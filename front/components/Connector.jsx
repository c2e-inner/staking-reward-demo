'use client'
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import Button from '@mui/material/Button';

export default function Connector({ children }) {
    const { isActive, account, connector, provider } = useWeb3React();

    useEffect(() => {
        setTimeout(() => {
            const active = connector.activate();
            active.then(() => {
                console.log("actived");
            })
        }, 500)
    }, [provider, connector, account]);
    return (
        <div>
            <div>
                state:{isActive ? ('active') : ('not active')}
            </div>
            <div>
                connect account: {account}
            </div>
            <Button
                variant='contained'
                onClick={async () => {
                    await connector.activate();
                }}>
                点击连接钱包
            </Button>
            {children}
        </div>
    );
}