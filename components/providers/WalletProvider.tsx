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
  
  // In a real implementation, we would use ethers.js, viem, or another web3 library
  // This is a simplified mock for demonstration purposes
  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Mock connection logic
      // In real implementation, this would use window.ethereum or another provider
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAccount = '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      setAccount(mockAccount);
      setIsConnected(true);
      
      // Get initial balance
      await getBalance();
      
      // Store connection in Zustand store
      createWalletStore.getState().setWallet({
        account: mockAccount,
        isConnected: true
      });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
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
    if (!account) return;
    
    try {
      // Mock balance fetch
      // In real implementation, this would call a contract or RPC
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockBalance = parseFloat((Math.random() * 1000).toFixed(2));
      
      setBalance(mockBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const storedWallet = createWalletStore.getState().wallet;
      
      if (storedWallet.isConnected && storedWallet.account) {
        setAccount(storedWallet.account);
        setIsConnected(true);
        await getBalance();
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
