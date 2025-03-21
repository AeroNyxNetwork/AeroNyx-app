/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-21 18:46:40
 */
'use client';

import { useState } from 'react';
import {
  Pencil,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  Circle,
  Server,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { shortenAddress } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import NodeModal from '@/components/dashboard/NodeModal';
import Image from 'next/image';
import { size } from 'lodash';
import { useNodeStore } from "@/store/nodeStore";
import { CopyData } from "@/lib/utils"
import Pagination from "@/components/layout/Pagination"
import AllNodesManageStake from "@/components/contractModal/AllNodesManageStake"



interface AllNode {
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

interface MyNodesTableProps {
  nodes: AllNode[];
  isLoading?: boolean;
}

export default function MyNodesTable({ nodes, isLoading = false }: MyNodesTableProps) {
  let [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [clickData, setClickData] = useState<AllNode | null>(null);
  const { allNodesTotalList, allNodesPagination, fetchAllNetworkNodes } = useNodeStore()


  // Create placeholder rows for loading state
  const placeholderRows = Array.from({ length: 8 }).map((_, index) => (
    <TableRow key={`placeholder-${index}`}>
      <TableCell>
        <Skeleton className="h-6 w-6 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded-md" />
      </TableCell>
    </TableRow>
  ));



  const callbackPagination = (pagination: number) => {
    useNodeStore.getState().allNodesPagination = pagination
    fetchAllNetworkNodes()

  }
  const ManageStake = (data: AllNode | null) => {
    setIsNodeModalOpen(true)
    setClickData(data)
  }






  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Pubkey</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>My Stake</TableHead>
              <TableHead>Points Earned</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              placeholderRows
            ) : nodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Server className="h-10 w-10 mb-2 opacity-40" />
                    <p>No nodes found</p>
                    <p className="text-sm">Deploy a node to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              nodes.map((node, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Circle
                        className={`h-3 w-3 text-green-500 fill-green-500`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{node.name || "Unknown"}</TableCell>
                  <TableCell className="font-medium">{node.offchain_ip || "Unknown"}</TableCell>
                  <TableCell className="font-medium">{node.city || "Unknown"}</TableCell>
                  <TableCell className="font-mono text-xs  flex space-x-1">
                    <div> {shortenAddress(node.serverkey)}</div>
                    <div><Copy size="16" onClick={() => CopyData(node.serverkey)}></Copy></div>
                  </TableCell>
                  <TableCell className="font-medium">{node.total || 0}</TableCell>
                  <TableCell className="font-medium">{node.myStake || 0}</TableCell>
                  <TableCell className="font-medium">{node.point || 0}</TableCell>
                  <Button className='mt-2' onClick={() => ManageStake(node)}> Manage Stake</Button>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {
        allNodesTotalList > 1 &&
        <Pagination
          totalPages={allNodesTotalList}
          currentPage={allNodesPagination}
          onPageChange={(e: number) => callbackPagination(e)}
        />
      }
      {
        isNodeModalOpen &&
        <AllNodesManageStake
          isOpen={isNodeModalOpen}
          onClose={() => setIsNodeModalOpen(false)}
          clickData={clickData}
        />
      }



    </>
  );
}
