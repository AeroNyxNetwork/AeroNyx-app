'use client';

import { useEffect, useState } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import MyNodesTable from '@/components/dashboard/MyNodesTable'; // Reuse the table component temporarily

export default function NetworkPage() {
  const { isConnected } = useWallet();
  const { fetchAllNodes, allNodes, isLoading } = useNodeStore();
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (isConnected) {
      fetchAllNodes(currentPage);
    }
  }, [isConnected, fetchAllNodes, currentPage]);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Network Nodes</h1>
        <p className="text-muted-foreground mt-2">
          Explore all active nodes on the AeroNyx network
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search nodes..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">All Network Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <MyNodesTable nodes={allNodes} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
