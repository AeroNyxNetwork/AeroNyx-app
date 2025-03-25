'use client';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  Loader,
  Server
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useToast } from '@/components/ui/use-toast';
import { useWallet } from "@solana/wallet-adapter-react";
import NetworkVisualization from '@/components/dashboard/NetworkVisualization';
import { useNodeStore } from '@/store/nodeStore';
import { createWalletStore } from '@/store/walletStore';
import { Header } from '@/components/layout/Header';
import { size } from 'lodash';
import { useToastStore } from "@/store/useToastStore";
import { AddServer } from "@/components/contract/AddServer"
import { useMediaQuery } from '@/hooks/useMediaQuery';
export default function RegisterNodePage() {
  const { balanceNumber, fetchBalance, myNodePubkey } = createWalletStore()
  const router = useRouter();
  const { wallet, publicKey } = useWallet();
  const { isLoading, myNodes } = useNodeStore();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // State variables
  const [nodeType, setNodeType] = useState<'server' | 'mobile'>('server');
  const [nodeName, setNodeName] = useState('');
  const [selectedPubKey, setSelectedPubKey] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState(1000);
  const [addNetworkLoading, setAddNetworkLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fetchMyNodes } = useNodeStore();
  useLayoutEffect(() => {
    if (publicKey) {
      createWalletStore.getState().fetchBalance(publicKey)
    }
  }, [publicKey])

  useEffect(() => {
    if (myNodePubkey && wallet) {
      fetchMyNodes(wallet);
    } else {
      useNodeStore.getState().isLoading = false
    }
  }, [wallet, myNodePubkey]);




  // Handle registration
  const handleRegister = async () => {
    const toast = useToastStore.getState().showToast;
    const pubKeyRegex = /^[A-Za-z0-9]{1,130}$/;

    // Validate Public Key
    if (!selectedPubKey || size(selectedPubKey) < 1) {
      toast("error", "No PubKey available to activate");
      return;
    }
    if (!pubKeyRegex.test(selectedPubKey)) {
      toast("error", "Please enter the correct PublicKey");
      return;
    }

    // Validate node name
    if (!nodeName || size(nodeName) < 1) {
      toast("error", "Please enter a name");
      return;
    }

    // Validate stake amount against balance
    if (stakeAmount > (balanceNumber ?? 0)) {
      toast("error", "Insufficient pledged coins");
      return;
    }

    // Validate stake amount within allowed range
    if (stakeAmount < 1000 || stakeAmount > 10000) {
      toast("error", "The pledged SNYX must be greater than 1000 and less than 10000");
      return;
    }

    // Validate wallet connection
    if (!wallet) {
      toast("error", "Please link your wallet first");
      return;
    }
    setAddNetworkLoading(true)

    const result = await AddServer(nodeName, stakeAmount, selectedPubKey, wallet, publicKey);
    if (result.code === "success") {
      toast("success", "success")
      router.push('/dashboard')
      setNodeName("")
      setSelectedPubKey(null)
      setStakeAmount(1000)
    } else {
      toast("error", result.msg)
    }
    setAddNetworkLoading(false)

  };

  // Set maximum stake amount
  const handleMaxStake = () => {
    if (balanceNumber) {
      if ((balanceNumber ?? 0) > 10000) {
        setStakeAmount(10000);
      } else {
        setStakeAmount((balanceNumber ?? 0));
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

      <Header
        onMenuClick={() => setIsSidebarOpen(prev => !prev)}
        showMenuButton={isMobile}
      ></Header>
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
                  {size(myNodes) > 0 ? (
                    myNodes.map((node, index) => (
                      <DropdownMenuItem
                        key={index}
                        disabled={node.code === 0}
                        onClick={() => node.code === 1 && setSelectedPubKey(node.pubkey)}
                      >
                        <div className="flex justify-between w-full items-center ">
                          <span className="font-mono">
                            {`${node.pubkey.substring(0, 8)}...${node.pubkey.substring(node.pubkey.length - 8)}`}
                          </span>
                          <span className={node.code === 1 ? 'text-green-400' : 'text-red-400'}>
                            {node.code === 1 ? 'Available' : 'Already registered'}
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
                  disabled={(balanceNumber ?? 0) < 1000}
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
                  <span className="text-md font-bold">{balanceNumber ? balanceNumber.toFixed(2) : '0.00'}</span>
                  <span className="text-sm">SNYX</span>
                </div>
              </div>
            </div>

            {/* Register button */}
            <Button
              className="btn-gradient w-full py-6 text-base font-medium"
              onClick={handleRegister}
            // disabled={isLoading || !isConnected}
            >

              {addNetworkLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Register to SOON Network'}
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
