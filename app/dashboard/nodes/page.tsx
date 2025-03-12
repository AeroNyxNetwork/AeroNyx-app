'use client';

import { useEffect } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MyNodesTable from '@/components/dashboard/MyNodesTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';

export default function NodesPage() {
  const { isConnected } = useWallet();
  const { fetchMyNodes, myNodes, isLoading } = useNodeStore();
  
  useEffect(() => {
    if (isConnected) {
      fetchMyNodes();
    }
  }, [isConnected, fetchMyNodes]);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Nodes</h1>
        <Button className="btn-gradient">
          <PlusCircle className="h-4 w-4 mr-2" />
          Deploy New Node
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">My Deployed Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <MyNodesTable nodes={myNodes} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
