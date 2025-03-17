/*
 * @Description:
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-17 14:09:04
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WalletState = {
  wallet: {
    account: string | null;
    isConnected: boolean;
  };
  nodeData: string | null;
  myNodePubkey: string | null;
  walletBalance: number | null;
  totalIncome: string | null;
  totalDay: string | null;
  nodelist: any[];
  userKeyData: any[];

  setWallet: (wallet: { account: string | null; isConnected: boolean }) => void;
  disconnect: () => void;
  setNodeData: (data: string) => void;
  setWalletBalance: (balance: number) => void;
  setTotalIncome: (income: string) => void;
  setTotalDay: (day: string) => void;
  setMyNodePubkey: (day: string) => void;
  setNodelist: (list: any[]) => void;
  setUserKeyData: (data: any[]) => void;
};

export const createWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallet: {
        account: null,
        isConnected: false,
      },
      nodeData: null,
      walletBalance: null,
      totalIncome: null,
      totalDay: null,
      nodelist: [],
      userKeyData: [],
      myNodePubkey: null,

      setWallet: (wallet) => set({ wallet }),
      disconnect: () =>
        set({
          wallet: { account: null, isConnected: false },
        }),
      setNodeData: (data) => set({ nodeData: data }),
      setWalletBalance: (balance) => set({ walletBalance: balance }),
      setTotalIncome: (income) => set({ totalIncome: income }),
      setTotalDay: (day) => set({ totalDay: day }),
      setNodelist: (list) => set({ nodelist: list }),
      setUserKeyData: (data) => set({ userKeyData: data }),

      // mynode
      setMyNodePubkey: (key) => set({ myNodePubkey: key }),
    }),
    {
      name: "aeronyx-wallet",
    }
  )
);
