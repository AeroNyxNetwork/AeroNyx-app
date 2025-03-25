/*
 * @Description:
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-25 11:05:49
 */
import { create } from "zustand";
import { API_ENDPOINTS } from "@/components/api";
import axios from "axios";
import { createWalletStore } from "@/store/walletStore";
import { filter, size, update, sumBy } from "lodash";
import { getMainAccountInfo } from "@/components/contract/getMainAccountInfo";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { useCallback } from "react";
interface AllNodeInfo {
  city: string;
  initialized: number;
  latitude: number;
  longitude: number;
  name: string;
  offchain_ip: string;
  offline: number;
  owner: string;
  serverkey: string;
  stake: number;
  total: number;
  total_delegators: number;
  myStake: number;
  point: number;
}
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
  contractName: string;
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
  allNetworkNodes: AllNodeInfo[];
  totalIncome: string | null;
  TotalDay: string | null;
  walletPublicKey: string | null;
  isLoading: boolean;
  allNodesLoading: boolean;
  allNodesTotalList: number;
  allNodesPagination: number;
  allNodesOwner: string | null;
  allNodesServerKey: string | null;
  allNodesName: string | null;

  fetchMyNodes: (wallet: any) => Promise<void>;
  fetchBenefitList: () => Promise<void>;
  fetchAllNetworkNodes: () => Promise<void>;
  fetchUserPoints: (owner: string, nodeKey: string) => Promise<void>;
  fetchUserStakeAmount: (serverkey: string, owner: string) => Promise<void>;
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
  allNetworkNodes: [],
  totalIncome: null,
  TotalDay: null,
  isLoading: true,
  allNodesLoading: true,
  walletPublicKey: null,
  allNodesTotalList: 0,
  allNodesPagination: 1,
  allNodesOwner: null,
  allNodesServerKey: null,
  allNodesName: null,

  fetchMyNodes: async (wallet: WalletAdapter) => {
    set({ isLoading: true });

    try {
      const res = await axios.get(API_ENDPOINTS.MY_NODES);
      const nodes = res.data.data;
      if (nodes && nodes.length > 0) {
        const nodeList = await Promise.all(
          nodes.map(async (node: Node) => {
            const userCity = await getCityData(node.ip);
            let accountInfo = await getMainAccountInfo(node.pubkey, wallet);
            return {
              ...node,
              ...accountInfo,
              city: userCity || "Unknown",
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
      }, 2000);
    }
  },

  // All Network Nodes
  fetchAllNetworkNodes: async () => {
    const { fetchUserStakeAmount, fetchUserPoints } = get();
    set({ allNodesLoading: true });
    let publicKey = get().walletPublicKey;
    let searchParams = {
      owner: get().allNodesOwner,
      serverKey: get().allNodesServerKey,
      name: get().allNodesName,
    };

    let search = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `&${key}=${value}`)
      .join("");

    try {
      let response = await axios.get(
        `${
          API_ENDPOINTS.All_NETWORK_NODES
        }/onchain/get_info_account?page_index=${
          get().allNodesPagination - 1
        }${search}`
      );
      if (size(response.data.data.items) > 0) {
        const nodes = response.data.data.items;
        const allNodeList = await Promise.all(
          nodes.map(async (node: AllNodeInfo) => {
            const safePublicKey = publicKey ?? "";
            let myStake = await fetchUserStakeAmount(
              node.serverkey,
              safePublicKey
            );
            let point = await fetchUserPoints(safePublicKey, node.serverkey);
            return {
              ...node,
              myStake,
              point,
            };
          })
        );
        set({ allNetworkNodes: allNodeList });
        set({
          allNodesTotalList: Math.ceil(response.data.data.all_count / 10),
        });
      } else {
        set({ allNetworkNodes: [] });
        set({ allNodesTotalList: 0 });
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        set({ allNodesLoading: false });
      }, 1000);
    }
  },

  fetchUserPoints: async (owner: string, nodeKey: string) => {
    if (!owner || !nodeKey) return 0;
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.All_NETWORK_NODES}/soon/get_reward_sum?soon_addr=${owner}&node_pubkey=${nodeKey}&page_size=100`
      );

      if (size(response.data.data.items) > 0) {
        const data = response.data.data.items;
        const userPoints = filter(data, (item) => item.soon_pubkey === owner);
        if (size(userPoints) > 0) {
          return userPoints[0].points;
        }
      }
      return 0;
    } catch (error) {
      console.error("Failed to get user points:", error);
      return 0;
    }
  },

  fetchUserStakeAmount: async (serverkey: string, owner: string) => {
    if (!serverkey || !owner) return 0;

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.All_NETWORK_NODES}/onchain/get_delegators?owner=${owner}&serverkey=${serverkey}`
      );

      if (size(response.data.data.items) > 0) {
        return response.data.data.items[0].stake;
      }
      return 0;
    } catch (error) {
      console.error("Failed to get user stake:", error);
      return 0;
    }
  },
}));
