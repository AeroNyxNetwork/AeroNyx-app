/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-25 10:46:53
 */
'use client';

import { useEffect, useRef } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MyNodesTable from '@/components/dashboard/MyNodesTable';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { createWalletStore } from "@/store/walletStore";
import { useRouter } from 'next/navigation';
import { useWallet } from "@solana/wallet-adapter-react";
export default function NodesPage() {
  const { fetchMyNodes, myNodes, isLoading } = useNodeStore();
  const router = useRouter();
  const { balanceNumber, fetchBalance, myNodePubkey } = createWalletStore();
  const { wallet, publicKey } = useWallet();
  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey)
    }
  }, [publicKey])

  useEffect(() => {
    const myNodePubkey = createWalletStore.getState().myNodePubkey;
    if (myNodePubkey && wallet) {
      fetchMyNodes(wallet);
    } else {
      useNodeStore.getState().isLoading = false
    }
  }, [wallet, myNodePubkey]);





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
