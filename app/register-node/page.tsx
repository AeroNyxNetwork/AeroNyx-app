'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ChevronDown, 
  ExternalLink, 
  AlertCircle, 
  HelpCircle,
  Server
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from '@/components/providers/WalletProvider';
import NetworkVisualization from '@/components/dashboard/NetworkVisualization';
import { useNodeStore } from '@/store/nodeStore';

export default function RegisterNodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isConnected, balance, connect } = useWallet();
  const { addNode } = useNodeStore();
  
  // State variables
  const [nodeType, setNodeType] = useState<'server' | 'mobile'>('server');
  const [nodeName, setNodeName] = useState('');
  const [selectedPubKey, setSelectedPubKey] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableNodes, setAvailableNodes] = useState<Array<{pubkey: string, status: string}>>([
    { pubkey: '0x7c9e73d4c71dae564d41f78d56439bb4ba87592f', status: 'available' },
    { pubkey: '0x8d71327d5e84d87a2ed52f674da8d4d65116217a', status: 'available' },
    { pubkey: '0x2c9e73d4c71dae564d41f78d56439bb4ba87593e', status: 'registered' }
  ]);
  
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
    
    setIsSubmitting(true);
    try {
      // Mock successful registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add node to store
      await addNode({
        id: Date.now().toString(),
        name: nodeName,
        pubkey: selectedPubKey!,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        status: 'online',
        staked: stakeAmount,
        earned: 0,
        code: 1
      });
      
      toast({
        title: "Registration successful",
        description: "Your node has been registered to the SOON network",
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error registering node:', error);
      toast({
        title: "Registration failed",
        description: "There was an error registering your node. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-background relative">
      {/* Background network visualization */}
      <NetworkVisualization />
      
      {/* Navigation */}
      <div className="p-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Button>
        
        <div className="flex gap-4">
          {isConnected ? (
            <Button variant="outline" className="px-6">
              <span className="font-mono">Balance: {balance?.toFixed(2)} SNYX</span>
            </Button>
          ) : (
            <Button onClick={connect} className="btn-gradient">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8 p-6">
        {/* Registration card */}
        <Card className="glass-card w-full lg:w-1/2">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-8">Register Node to SOON Network</h1>
            
            {/* Node type selector */}
            <div className="mb-8">
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
            <div className="mb-8">
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
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? 'Processing...' : 'Register to SOON Network'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Illustration */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
          <div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute w-80 h-80 rounded-full bg-secondary/10 blur-3xl -translate-x-20 translate-y-20"></div>
          <Server className="w-64 h-64 text-primary opacity-20" />
          <div className="absolute inset-0 cyber-grid"></div>
        </div>
      </div>
    </div>
  );
}
