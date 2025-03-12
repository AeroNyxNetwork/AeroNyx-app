// In components/providers/WalletProvider.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createWalletStore } from '@/store/walletStore';

type WalletContextType = {
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  balance: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getBalance: () => Promise<void>;
};

const defaultContext: WalletContextType = {
  isConnected: false,
  isConnecting: false,
  account: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
  getBalance: async () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  
  // Check if OKX wallet is available
  const checkOKXWallet = () => {
    // OKX wallet injects itself as 'okxwallet' in the window object
    return typeof window !== 'undefined' && window.okxwallet !== undefined;
  };
  
  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Check if OKX wallet is installed
      if (!checkOKXWallet()) {
        window.open('https://www.okx.com/web3', '_blank');
        setIsConnecting(false);
        return;
      }
      
      // Request accounts from OKX wallet
      const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);
        
        // Store connection in Zustand store
        createWalletStore.getState().setWallet({
          account: account,
          isConnected: true
        });
        
        // Get initial balance
        await getBalance();
      }
    } catch (error) {
      console.error('Error connecting to OKX wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setIsConnected(false);
    
    // Update Zustand store
    createWalletStore.getState().disconnect();
  };
  
  const getBalance = async () => {
    if (!account || !checkOKXWallet()) return;
    
    try {
      // Get ETH balance from OKX wallet
      const balanceHex = await window.okxwallet.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      // Convert hex balance to decimal (divide by 10^18 for ETH)
      const balanceWei = parseInt(balanceHex, 16);
      const balanceETH = balanceWei / 1e18;
      
      setBalance(parseFloat(balanceETH.toFixed(4)));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (checkOKXWallet()) {
        try {
          const accounts = await window.okxwallet.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            await getBalance();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <WalletContext.Provider 
      value={{ 
        isConnected, 
        isConnecting, 
        account, 
        balance, 
        connect, 
        disconnect, 
        getBalance 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
