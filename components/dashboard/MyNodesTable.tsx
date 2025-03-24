/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-24 18:05:45
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
import PasswordDialog from "@/components/contractModal/Password"
import MyNodesName from "@/components/contractModal/MyNodesName"
import MyNodesStaking from "@/components/contractModal/MyNodesStaking"




interface Node {
  check_status: null;
  check_update_time: null;
  country: string;
  ip: string;
  earned_today: number;
  name: string;
  city: string;
  node_type: number;
  node_update_time: number;
  code: number;
  offline: number;
  number: number;
  passcode: string;
  port: string;
  pubkey: string;
  contractName: string;
}

interface MyNodesTableProps {
  nodes: Node[];
  isLoading?: boolean;
}

interface Passcode {
  key: string,
  isOpen: boolean
}




export default function MyNodesTable({ nodes, isLoading = false }: MyNodesTableProps) {
  const [isPasscode, setisPasscode] = useState<Passcode>({
    key: "",
    isOpen: false
  });
  const [isNodesName, setIsNodesName] = useState<Passcode>({
    key: "",
    isOpen: false
  });

  const [isMyNodesStaking, setIsMyNodesStaking] = useState<Passcode>({
    key: "",
    isOpen: false
  });


  // Points Earned
  const CalculateBenefits = (key: string) => {
    let BenefitsList = useNodeStore.getState().BenefitList
    if (size(BenefitsList) > 0) {
      let data = BenefitsList.filter((item: any) => item.pubkey == key)
      return size(data) > 0 ? data[0].earned_today.toFixed(2) : "0.00"
    } else {
      return "0.00"
    }

  }
  // Time Connected
  const OnlineTime = (key: string) => {
    let BenefitList = useNodeStore.getState().BenefitList
    if (size(BenefitList) > 0) {
      let data = BenefitList.filter((item: any) => item.pubkey == key)
      if (size(data) > 0) {
        let online_seconds = Number(data[0].online_seconds + data[0].online_seconds_today)
        return (online_seconds / 3600).toFixed(1)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  const Online = (key: string) => {
    let BenefitList = useNodeStore.getState().BenefitList
    if (size(BenefitList) > 0) {
      let data = BenefitList.filter((item: any) => item.pubkey == key)
      if (size(data) > 0) {
        return data[0].offline == 0 ? "online" : "Not_online"
      } else {
        return "Not_online"
      }
    } else {
      return "Not_online"
    }
  }

  // Create placeholder rows for loading state
  const placeholderRows = Array.from({ length: 4 }).map((_, index) => (
    <TableRow key={`placeholder-${index}`}>
      <TableCell>
        <Skeleton className="h-6 w-6 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
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

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pubkey</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Time Connected</TableHead>
              <TableHead>On-chain</TableHead>
              <TableHead>Staking</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Points Earned</TableHead>
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
                        className={`h-3 w-3 ${Online(node.pubkey) === 'online' ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer"
                    onClick={() => node.code == 0 && setIsNodesName({
                      key: node.pubkey,
                      isOpen: true
                    })}
                  >
                    {node.contractName ? node.contractName : node.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs  flex space-x-1">
                    <div> {shortenAddress(node.pubkey)}</div>
                    <div><Copy size="16" onClick={() => CopyData(node.pubkey)}></Copy></div>
                  </TableCell>
                  <TableCell className=" text-xs">
                    {node.ip}
                  </TableCell>
                  <TableCell className=" text-xs">
                    {node.city}
                  </TableCell>
                  <TableCell className=" text-xs">
                    {OnlineTime(node.pubkey)} Hours
                  </TableCell>
                  <TableCell className=" text-xs">
                    {node.code == 0 ? "YES" : "NO"}
                  </TableCell>
                  <TableCell className=" text-xs cursor-pointer"
                    onClick={() => setIsMyNodesStaking({
                      key: node.pubkey,
                      isOpen: true
                    })}  >
                    {node.code == 0 ? node.number : 0} SNYX
                  </TableCell>
                  <TableCell className="text-xs cursor-pointer" onClick={() => setisPasscode({
                    key: node.pubkey,
                    isOpen: true
                  })}  >
                    {node.passcode ? "YES" : "NO"}
                  </TableCell>
                  <TableCell className=" flex text-xs  space-x-2">
                    <Image src="/aeronyx_logo1.png" alt="" width={20} height={20} />
                    <div>{CalculateBenefits(node.pubkey)}</div>
                  </TableCell>


                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Node Modal */}
      {isPasscode && (
        <PasswordDialog
          isOpen={isPasscode}
          onClose={() => setisPasscode({
            key: "",
            isOpen: false
          })}
        />
      )}
      {isNodesName && (
        <MyNodesName
          isOpen={isNodesName}
          onClose={() => setIsNodesName({
            key: "",
            isOpen: false
          })}
        />
      )}
      {isMyNodesStaking && (
        <MyNodesStaking
          isOpen={isMyNodesStaking}
          onClose={() => setIsMyNodesStaking({
            key: "",
            isOpen: false
          })}
        />
      )}
    </>
  );
}
