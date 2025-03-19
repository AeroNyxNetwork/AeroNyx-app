import { create } from "zustand";
import { API_ENDPOINTS } from "@/components/api";
import axios from "axios";
import { createWalletStore } from "@/store/walletStore";
import { filter, size, update, sumBy } from "lodash";
import { getMainAccountInfo } from "@/components/contract/getMainAccountInfo";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
type Node = {
  check_status: null;
  check_update_time: null;
  country: string;
  ip: string;
  name: string;
  node_type: number;
  node_update_time: number;
  passcode: string;
  city: string;
  earned_today: number;
  online_seconds: number;
  code: number;
  number: number;
  offline: number;
  online_seconds_today: number;
  port: string;
  pubkey: string;
};

type NetworkStats = {
  totalNodes: number;
  activeNodes: number;
  totalStaked: number;
  averageRewards: number;
};

type NodeState = {
  myNodes: Node[];
  BenefitList: Node[];
  allNodes: Node[];
  totalIncome: string | null;
  TotalDay: string | null;
  isLoading: boolean;

  fetchMyNodes: (wallet: any) => Promise<void>;
  fetchBenefitList: () => Promise<void>;
};

const getCityData = async (ip: string): Promise<string | null> => {
  try {
    const callCity = await axios.get(
      `${API_ENDPOINTS.GET_MYNODE_CITY}${ip}/json/`
    );
    return callCity?.data?.error ? null : callCity?.data?.country_capital;
  } catch {
    return null;
  }
};

export const useNodeStore = create<NodeState>((set, get) => ({
  myNodes: [],
  BenefitList: [],
  allNodes: [],
  totalIncome: null,
  TotalDay: null,
  isLoading: true,

  fetchMyNodes: async (wallet: WalletAdapter) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(API_ENDPOINTS.MY_NODES);
      const nodes = res.data.data;
      if (nodes && nodes.length > 0) {
        const nodeList = await Promise.all(
          nodes.map(async (node: Node) => {
            const userCity = (await getCityData(node.ip)) || "Unknown";
            let accountInfo = await getMainAccountInfo(node.pubkey, wallet);
            return {
              ...node,
              ...accountInfo,
              city: userCity,
            };
          })
        );
        set({ myNodes: nodeList });
      }
    } catch (error) {
      console.error("Error fetching my nodes:", error);
    } finally {
      get().fetchBenefitList();
    }
  },

  fetchBenefitList: async () => {
    set({ isLoading: true });
    try {
      const userKey = createWalletStore.getState().myNodePubkey;
      let List = await axios.get(
        `${API_ENDPOINTS.GET_BENEFIT_LIST}?pubkey=${userKey}`
      );
      let totalIncome = sumBy(List.data.data, (item: any) => item.earned);
      let TotalDay = sumBy(List.data.data, (item: any) => item.earned_today);
      set({ BenefitList: List.data.data });
      set({ totalIncome: totalIncome.toFixed(2) });
      set({ TotalDay: TotalDay.toFixed(2) });
    } catch (error) {
    } finally {
      setTimeout(() => {
        set({ isLoading: false });
      }, 3000);
    }
  },
}));
