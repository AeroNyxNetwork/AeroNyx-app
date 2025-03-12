import { create } from 'zustand';

type Node = {
  id: string;
  name: string;
  pubkey: string;
  ip: string;
  city?: string;
  country?: string;
  status: 'online' | 'offline';
  staked: number;
  earned: number;
  code: number;
  passcode?: string;
};

type NetworkStats = {
  totalNodes: number;
  activeNodes: number;
  totalStaked: number;
  averageRewards: number;
};

type NodeState = {
  myNodes: Node[];
  allNodes: Node[];
  selectedNode: Node | null;
  isLoading: boolean;
  networkStats: NetworkStats;
  
  fetchMyNodes: () => Promise<void>;
  fetchAllNodes: (page: number, filters?: Record<string, any>) => Promise<void>;
  selectNode: (node: Node | null) => void;
  addNode: (node: Node) => Promise<void>;
  updateNode: (id: string, updates: Partial<Node>) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  stakeOnNode: (id: string, amount: number) => Promise<void>;
  withdrawFromNode: (id: string, amount: number) => Promise<void>;
  fetchNetworkStats: () => Promise<void>;
  
  // Registration-related function
  registerNode: (nodeData: {
    name: string;
    pubkey: string;
    stakeAmount: number;
    nodeType: 'server' | 'mobile';
  }) => Promise<string>;
};

// Mock data for demonstration
const mockNodes: Node[] = [
  {
    id: '1',
    name: 'Node Alpha',
    pubkey: '0x7c9e73d4c71dae564d41f78d56439bb4ba87592f',
    ip: '192.168.1.1',
    city: 'New York',
    country: 'USA',
    status: 'online',
    staked: 1500,
    earned: 120,
    code: 1,
  },
  {
    id: '2',
    name: 'Node Beta',
    pubkey: '0x8d71327d5e84d87a2ed52f674da8d4d65116217a',
    ip: '192.168.1.2',
    city: 'Los Angeles',
    country: 'USA',
    status: 'online',
    staked: 3000,
    earned: 250,
    code: 1,
  },
  {
    id: '3',
    name: 'Node Gamma',
    pubkey: '0x2c9e73d4c71dae564d41f78d56439bb4ba87593e',
    ip: '192.168.1.3',
    city: 'San Francisco',
    country: 'USA',
    status: 'offline',
    staked: 2000,
    earned: 180,
    code: 0,
    passcode: '123456',
  },
];

export const useNodeStore = create<NodeState>((set, get) => ({
  myNodes: [],
  allNodes: [],
  selectedNode: null,
  isLoading: false,
  networkStats: {
    totalNodes: 0,
    activeNodes: 0,
    totalStaked: 0,
    averageRewards: 0,
  },
  
  fetchMyNodes: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      set({ myNodes: mockNodes });
    } catch (error) {
      console.error('Error fetching my nodes:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchAllNodes: async (page, filters = {}) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be a paginated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate more mock data for all nodes
      const mockAllNodes = [...mockNodes];
      for (let i = 4; i <= 20; i++) {
        mockAllNodes.push({
          id: i.toString(),
          name: `Node ${i}`,
          pubkey: `0x${i}c9e73d4c71dae564d41f78d56439bb4ba87593e`,
          ip: `192.168.1.${i}`,
          city: i % 3 === 0 ? 'Singapore' : i % 2 === 0 ? 'Berlin' : 'Tokyo',
          country: i % 3 === 0 ? 'Singapore' : i % 2 === 0 ? 'Germany' : 'Japan',
          status: i % 4 === 0 ? 'offline' : 'online',
          staked: 1000 + (i * 500),
          earned: 50 + (i * 10),
          code: i % 5 === 0 ? 0 : 1,
        });
      }
      
      // Apply pagination
      const startIndex = (page - 1) * 10;
      const paginatedNodes = mockAllNodes.slice(startIndex, startIndex + 10);
      
      set({ allNodes: paginatedNodes });
    } catch (error) {
      console.error('Error fetching all nodes:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectNode: (node) => {
    set({ selectedNode: node });
  },
  
  addNode: async (node) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { myNodes } = get();
      set({ myNodes: [...myNodes, node] });
    } catch (error) {
      console.error('Error adding node:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateNode: async (id, updates) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { myNodes } = get();
      const updatedNodes = myNodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      );
      
      set({ myNodes: updatedNodes });
    } catch (error) {
      console.error('Error updating node:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteNode: async (id) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { myNodes } = get();
      const filteredNodes = myNodes.filter(node => node.id !== id);
      
      set({ myNodes: filteredNodes });
    } catch (error) {
      console.error('Error deleting node:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  stakeOnNode: async (id, amount) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { myNodes, allNodes } = get();
      
      // Update in myNodes
      const updatedMyNodes = myNodes.map(node =>
        node.id === id ? { ...node, staked: node.staked + amount } : node
      );
      
      // Update in allNodes if present
      const updatedAllNodes = allNodes.map(node =>
        node.id === id ? { ...node, staked: node.staked + amount } : node
      );
      
      set({ 
        myNodes: updatedMyNodes,
        allNodes: updatedAllNodes
      });
    } catch (error) {
      console.error('Error staking on node:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  withdrawFromNode: async (id, amount) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { myNodes, allNodes } = get();
      
      // Update in myNodes
      const updatedMyNodes = myNodes.map(node =>
        node.id === id ? { ...node, staked: Math.max(0, node.staked - amount) } : node
      );
      
      // Update in allNodes if present
      const updatedAllNodes = allNodes.map(node =>
        node.id === id ? { ...node, staked: Math.max(0, node.staked - amount) } : node
      );
      
      set({ 
        myNodes: updatedMyNodes,
        allNodes: updatedAllNodes
      });
    } catch (error) {
      console.error('Error withdrawing from node:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchNetworkStats: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate mock network stats
      const totalNodes = 1500;
      const activeNodes = 1200;
      const totalStaked = 7500000;
      const averageRewards = 125.5;
      
      set({
        networkStats: {
          totalNodes,
          activeNodes,
          totalStaked,
          averageRewards
        }
      });
    } catch (error) {
      console.error('Error fetching network stats:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Node registration function
  registerNode: async (nodeData) => {
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call to your blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a new node ID
      const nodeId = Date.now().toString();
      
      // Create the new node object with proper typing for status
      const newNode: Node = {
        id: nodeId,
        name: nodeData.name,
        pubkey: nodeData.pubkey,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        city: 'New York', // Default or detect based on IP
        country: 'USA', // Default or detect based on IP
        status: 'online', // Explicitly set as 'online' to match the Node type
        staked: nodeData.stakeAmount,
        earned: 0,
        code: 1,
      };
      
      // Add node to the store
      const { myNodes } = get();
      set({ 
        myNodes: [...myNodes, newNode],
        selectedNode: newNode
      });
      
      // Update network stats
      const { networkStats } = get();
      set({
        networkStats: {
          ...networkStats,
          totalNodes: networkStats.totalNodes + 1,
          activeNodes: networkStats.activeNodes + 1,
          totalStaked: networkStats.totalStaked + nodeData.stakeAmount
        }
      });
      
      return nodeId;
    } catch (error) {
      console.error('Error registering node:', error);
      throw new Error('Failed to register node');
    } finally {
      set({ isLoading: false });
    }
  }
}));
