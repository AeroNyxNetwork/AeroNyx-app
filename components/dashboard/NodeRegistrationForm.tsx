'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from '@/components/providers/WalletProvider';
import { useNodeStore } from '@/store/nodeStore';

interface NodeRegistrationFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function NodeRegistrationForm({ onSuccess, className }: NodeRegistrationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isConnected, balance } = useWallet();
  const { registerNode, isLoading } = useNodeStore();
  
  // State variables
  const [nodeType, setNodeType] = useState<'server' | 'mobile'>('server');
  const [nodeName, setNodeName] = useState('');
  const [selectedPubKey, setSelectedPubKey] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState(1000);
  
  // Mock available nodes
  const availableNodes = [
    { pubkey: '0x7c9e73d4c71dae564d41f78d56439bb4ba87592f', status: 'available' },
    { pubkey: '0x8d71327d5e84d87a2ed52f674da8d4d65116217a', status: 'available' },
    { pubkey: '0x2c9e73d4c71dae564d41f78d56439bb4ba87593e', status: 'registered' }
  ];
  
  // Validate input
  const validateInput = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return false;
    }
    
    if (!selectedPubKey) {
      toast({
        title: "No node selected",
        description: "Please select a node to register",
        variant: "destructive"
      });
      return false;
    }
    
    if (!nodeName || nodeName.trim().length === 0) {
      toast({
        title: "Name required",
        description: "Please enter a name for your node",
        variant: "destructive"
      });
      return false;
    }
    
    if (stakeAmount < 1000 || stakeAmount > 10000) {
      toast({
        title: "Invalid stake amount",
        description: "Stake amount must be between 1000 and 10000 SNYX",
        variant: "destructive"
      });
      return false;
    }
    
    if (balance && stakeAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${stakeAmount} SNYX to stake`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  // Handle registration
  const handleRegister = async () => {
    if (!validateInput()) return;
    
    try {
      await registerNode({
        name: nodeName,
        pubkey: selectedPubKey!,
        stakeAmount,
        nodeType
      });
      
      toast({
        title: "Registration successful",
        description: "Your node has been registered to the SOON network",
      });
      
      // Reset form
      setNodeName('');
      setSelectedPubKey(null);
      setStakeAmount(1000);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Otherwise redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error registering node:', error);
      toast({
        title: "Registration failed",
        description: "There was an error registering your node. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Set maximum stake amount
  const handleMaxStake = () => {
    if (balance) {
      if (balance > 10000) {
        setStakeAmount(10000);
      } else {
        setStakeAmount(balance);
      }
    }
  };
  
  // Open documentation
  const openDocs = (path: string) => {
    window.open(`https://docs.aeronyx.network/${path}`, '_blank');
  };
  
  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-6">Register New Node</h2>
      
      {/* Node type selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Node Type
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-64 flex justify-between items-center">
              <span>{nodeType === 'server' ? 'Server Node' : 'Mobile Device'}</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuItem onClick={() => setNodeType('server')}>
              Server Node
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setNodeType('mobile')}>
              Mobile Device
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Node selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Select Node to Register
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>
                {selectedPubKey
                  ? `${selectedPubKey.substring(0, 8)}...${selectedPubKey.substring(selectedPubKey.length - 8)}`
                  : nodeType === 'server' 
                    ? 'Select Public Key' 
                    : 'Select MAC Address'
                }
              </span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
            {availableNodes.length > 0 ? (
              availableNodes.map((node, index) => (
                <DropdownMenuItem
                  key={index}
                  disabled={node.status === 'registered'}
                  onClick={() => node.status === 'available' && setSelectedPubKey(node.pubkey)}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="font-mono">
                      {`${node.pubkey.substring(0, 8)}...${node.pubkey.substring(node.pubkey.length - 8)}`}
                    </span>
                    <span className={node.status === 'available' ? 'text-green-400' : 'text-red-400'}>
                      {node.status === 'available' ? 'Available' : 'Already registered'}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No online nodes found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="link" 
          className="text-primary text-sm p-0 h-auto mt-2"
          onClick={() => openDocs('decentralized-node-documentation/run-aeronyx-decentralized-nodes-on-your-server-using-docker')}
        >
          <span>How to find the {nodeType === 'server' ? 'Public Key' : 'MAC Address'}?</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      {/* Node name input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Node Name
        </label>
        <Input
          placeholder="Enter a name"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          className="bg-background/30 border-white/10"
        />
        <p className="text-xs text-muted-foreground mt-2">
          The name will be registered on the SOON network
        </p>
      </div>
      
      {/* Stake amount input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Stake Amount
        </label>
        <div className="flex items-center">
          <Input
            type="number"
            min={1000}
            max={10000}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            className="bg-background/30 border-white/10"
          />
          <span className="mx-2">SNYX</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMaxStake}
            className="h-8 text-xs"
            disabled={!balance}
          >
            MAX
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Minimum 1000 SNYX, Maximum 10000 SNYX
        </p>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="link" 
            className="text-primary text-sm p-0 h-auto"
            onClick={() => openDocs('decentralized-node-documentation/snyx-token-guide-for-aeronyx-network')}
          >
            <span>How to get SNYX?</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-sm">Balance:</span>
            <span className="text-md font-bold">{balance ? balance.toFixed(2) : '0.00'}</span>
            <span className="text-sm">SNYX</span>
          </div>
        </div>
      </div>
      
      {/* Register button */}
      <Button 
        className="btn-gradient w-full py-6 text-base font-medium"
        onClick={handleRegister}
        disabled={isLoading || !isConnected}
      >
        {isLoading ? 'Processing...' : 'Register to SOON Network'}
      </Button>
    </div>
  );
}
