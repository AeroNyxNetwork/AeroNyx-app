/*
 * @Description:
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-21 16:48:09
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBalance } from "@/components/contract/getBalance";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface NodeState {
  balanceNumber: number | null;
  myNodePubkey: string | null;
  fetchBalance: (publicKey: PublicKey | null) => void;
  setMyNodePubkey: (day: string) => void;
}

export const createWalletStore = create<NodeState>((set, get) => ({
  balanceNumber: 0,
  myNodePubkey: null,
  fetchBalance: async (publicKey: PublicKey | null) => {
    if (!publicKey) return;
    try {
      let result = await getBalance(publicKey);
      if (result.code === 0) {
        set({ balanceNumber: result.number });
      }
    } catch (error) {}
  },

  // mynode
  setMyNodePubkey: (key) => set({ myNodePubkey: key }),
}));
