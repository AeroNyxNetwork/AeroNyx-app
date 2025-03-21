/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-21 16:48:14
 */
'use client';

import { useEffect, useState } from 'react';
import { useNodeStore } from '@/store/nodeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useWallet } from "@solana/wallet-adapter-react";
import AllNetworkNodesTable from '@/components/dashboard/AllNetworkNodesTable'; // Reuse the table component temporarily
import { createWalletStore } from "@/store/walletStore"



export default function NetworkPage() {
  const { publicKey } = useWallet();
  const { allNetworkNodes, allNodesLoading, fetchAllNetworkNodes, allNodesOwner, allNodesServerKey, allNodesName } = useNodeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [queries, setQueries] = useState({ owner: "", name: "", serverkey: "", });
  useEffect(() => {

    setTimeout(() => {
      if (publicKey?.toString()) {
        useNodeStore.getState().walletPublicKey = publicKey?.toString()
        fetchAllNetworkNodes();
        createWalletStore.getState().fetchBalance(publicKey)
      }
    }, 1000)

  }, [publicKey?.toString()]);

  const handleChange = (field: string, value: string) => {
    setQueries((prev) => ({ ...prev, [field]: value }));
  };


  const handleSearch = () => {
    useNodeStore.getState().allNodesOwner = queries.owner
    useNodeStore.getState().allNodesServerKey = queries.serverkey
    useNodeStore.getState().allNodesName = queries.name
    useNodeStore.getState().fetchAllNetworkNodes()
  };

  const handleClear = () => {
    setQueries({ owner: "", name: "", serverkey: "" });
    useNodeStore.getState().allNodesOwner = null
    useNodeStore.getState().allNodesServerKey = null
    useNodeStore.getState().allNodesName = null
    useNodeStore.getState().fetchAllNetworkNodes()
  };



  return (
    <div className="space-y-8">

      <div className="p-4 text-white rounded-lg">

        <div className="flex flex-col lg:flex-row  lg:justify-between space-y-4 lg:space-y-0">

          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 lg:w-2/3">

            <div className="flex items-center flex-1">
              <span className="w-16 text-gray-300">Owner:</span>
              <Input
                className="flex-1  text-white border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter Owner..."
                value={queries.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
              />
            </div>


            <div className="flex items-center flex-1">
              <span className="w-16 text-gray-300">Name:</span>
              <Input
                className="flex-1  text-white border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter Name..."
                value={queries.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>


            <div className="flex items-center flex-1">
              <span className="w-24 text-gray-300">ServerKey:</span>
              <Input
                className="flex-1  text-white border border-gray-600 rounded-md px-3 py-2"
                placeholder="Enter ServerKey..."
                value={queries.serverkey}
                onChange={(e) => handleChange("serverkey", e.target.value)}
              />
            </div>
          </div>


          <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:w-[200px] lg:justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 flex-1 lg:w-auto" onClick={handleSearch}>
              <Search className="h-5 w-5 mr-1" />
              Search
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 flex-1 lg:w-auto"
              onClick={handleClear}
            >
              <X className="h-5 w-5 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">All Network Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <AllNetworkNodesTable nodes={allNetworkNodes} isLoading={allNodesLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
