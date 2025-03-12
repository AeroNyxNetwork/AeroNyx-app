'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Clock, DollarSign, Activity, Server, PlusCircle } from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NodeStatsCard from '@/components/dashboard/NodeStatsCard';
import EarningsChart from '@/components/dashboard/EarningsChart';
import MyNodesTable from '@/components/dashboard/MyNodesTable';
import NetworkStats from '@/components/dashboard/NetworkStats';
import NetworkVisualization from '@/components/dashboard/NetworkVisualization';
import RegisterNodeModal from '@/components/dashboard/RegisterNodeModal';
import { useNodeStore } from '@/store/nodeStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const { 
    fetchMyNodes, 
    fetchNetworkStats, 
    myNodes, 
    networkStats,
    isLoading 
  } = useNodeStore();
  
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  
  useEffect(() => {
    // Fetch data when component mounts
    if (isConnected) {
      fetchMyNodes();
      fetchNetworkStats();
      
      // Mock earnings data
      setTotalEarnings(Math.random() * 2000);
      setTodayEarnings(Math.random() * 50);
    }
  }, [isConnected, fetchMyNodes, fetchNetworkStats]);
  
  return (
    <div className="space-y-8 relative">
      {/* Background network visualization */}
      <NetworkVisualization />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your nodes, earnings, and network statistics
          </p>
        </div>
        
        {/* Register Node Button */}
        <RegisterNodeModal />
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NodeStatsCard 
          title="My Nodes"
          value={myNodes.length.toString()}
          description="Active nodes on the network"
          icon={Server}
          trend={{ value: 0, isPositive: true }}
          loading={isLoading}
        />
        
        <NodeStatsCard 
          title="Total Earnings"
          value={`${totalEarnings.toFixed(2)} SNYX`}
          description="Across all nodes"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          loading={isLoading}
        />
        
        <NodeStatsCard 
          title="Today's Earnings"
          value={`${todayEarnings.toFixed(2)} SNYX`}
          description="Last 24 hours"
          icon={Activity}
          trend={{ value: 3.2, isPositive: true }}
          loading={isLoading}
        />
        
        <NodeStatsCard 
          title="Total Hours"
          value={(myNodes.length * 24 * 7).toString() + "h"}
          description="Nodes online time"
          icon={Clock}
          trend={{ value: 0, isPositive: true }}
          loading={isLoading}
        />
      </div>
      
      {/* Earnings Chart and Network Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-2 overflow-hidden relative">
          {/* Add subtle gradient border */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl" />
          
          <CardHeader className="pb-2 z-10 relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Earnings Statistics</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
                View Details
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <EarningsChart />
          </CardContent>
        </Card>
        
        <NetworkStats stats={networkStats} isLoading={isLoading} />
      </div>
      
      {/* My Nodes Table */}
      <Card className="glass-card overflow-hidden relative">
        {/* Add subtle gradient border */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl" />
        
        <CardHeader className="pb-2 z-10 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">My Nodes</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => router.push('/register-node')}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Deploy Node
            </Button>
          </div>
        </CardHeader>
        <CardContent className="z-10 relative">
          <MyNodesTable nodes={myNodes} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
