'use client';

import { useState } from 'react';
import {
  Pencil,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  Circle,
  Server
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

interface Node {
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
}

interface MyNodesTableProps {
  nodes: Node[];
  isLoading?: boolean;
}

export default function MyNodesTable({ nodes, isLoading = false }: MyNodesTableProps) {
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [modalType, setModalType] = useState<'staking' | 'passcode' | 'edit'>('staking');
  
  const handleNodeAction = (node: Node, action: 'staking' | 'passcode' | 'edit') => {
    setSelectedNode(node);
    setModalType(action);
    setIsNodeModalOpen(true);
  };
  
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
              <TableHead>Location</TableHead>
              <TableHead>Staked</TableHead>
              <TableHead>Earned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
              nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Circle 
                        className={`h-3 w-3 ${node.status === 'online' ? 'text-green-500 fill-green-500' : 'text-red-500 fill-red-500'}`} 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {shortenAddress(node.pubkey)}
                  </TableCell>
                  <TableCell>
                    {node.city ? `${node.city}, ${node.country}` : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {node.staked.toLocaleString()} SNYX
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{node.earned.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs bg-primary bg-opacity-10 text-primary border-primary border-opacity-30">
                        <ArrowUp className="mr-1 h-3 w-3" />
                        2.3%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={node.status === 'online' ? 'default' : 'secondary'}
                      className={node.status === 'online' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                    >
                      {node.status === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleNodeAction(node, 'staking')}>
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Manage Stake
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNodeAction(node, 'edit')}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNodeAction(node, 'passcode')}>
                          <Server className="mr-2 h-4 w-4" />
                          Set Passcode
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Node Modal */}
      {selectedNode && (
        <NodeModal
          isOpen={isNodeModalOpen}
          onClose={() => setIsNodeModalOpen(false)}
          node={selectedNode}
          type={modalType}
        />
      )}
    </>
  );
}
