/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-17 10:06:50
 */
'use client';

import { useEffect } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MyNodesTable from '@/components/dashboard/MyNodesTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { useRouter } from 'next/navigation';
export default function NodesPage() {
  const { isConnected } = useWallet();
  const { fetchMyNodes, myNodes, isLoading } = useNodeStore();
  const router = useRouter();
  useEffect(() => {
    if (isConnected) {
      fetchMyNodes();
    }
  }, [isConnected, fetchMyNodes]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pt-4" >
        <h1 className="text-3xl font-bold">My Nodes</h1>
        <Button className="btn-gradient" onClick={() => router.push('/register-node')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Deploy New Node
        </Button>
      </div>

      <Card className="glass-card  mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">My Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <MyNodesTable nodes={myNodes} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
