'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { shortenAddress } from '@/lib/utils';
import { useNodeStore } from '@/store/nodeStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

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

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node;
  type: 'staking' | 'passcode' | 'edit';
}

export default function NodeModal({
  isOpen,
  onClose,
  node,
  type
}: NodeModalProps) {
  const { updateNode, stakeOnNode, withdrawFromNode } = useNodeStore();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState(node.name);
  const [passcode, setPasscode] = useState(node.passcode || '');
  const [stakingAmount, setStakingAmount] = useState<string>('500');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  const handleUpdateName = async () => {
    if (!nodeName || nodeName === node.name) return onClose();
    
    setIsSubmitting(true);
    try {
      await updateNode(node.id, { name: nodeName });
      toast({
        title: 'Node name updated',
        description: `Node has been renamed to ${nodeName}`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating node name',
        description: 'There was an error updating the node name. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSetPasscode = async () => {
    if (!passcode || passcode === node.passcode) return onClose();
    
    setIsSubmitting(true);
    try {
      await updateNode(node.id, { passcode });
      toast({
        title: 'Passcode updated',
        description: 'Node passcode has been updated successfully',
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating passcode',
        description: 'There was an error updating the passcode. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStake = async () => {
    const amount = parseFloat(stakingAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    try {
      await stakeOnNode(node.id, amount);
      toast({
        title: 'Stake successful',
        description: `Successfully staked ${amount} SNYX on node ${node.name}`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error staking',
        description: 'There was an error staking on this node. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > node.staked) return;
    
    setIsSubmitting(true);
    try {
      await withdrawFromNode(node.id, amount);
      toast({
        title: 'Withdrawal successful',
        description: `Successfully withdrew ${amount} SNYX from node ${node.name}`,
      });
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error withdrawing',
        description: 'There was an error withdrawing from this node. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStakingContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Node</span>
          <span className="font-medium">{node.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Public Key</span>
          <span className="font-mono">{shortenAddress(node.pubkey)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Stake</span>
          <span className="font-medium">{node.staked.toLocaleString()} SNYX</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Earned</span>
          <span className="font-medium">{node.earned.toLocaleString()} SNYX</span>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deposit' | 'withdraw')}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staking-amount">Amount to Stake</Label>
              <div className="relative">
                <Input
                  id="staking-amount"
                  type="number"
                  placeholder="500"
                  min="500"
                  max="10000"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">SNYX</span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Min: 500 SNYX</span>
                <span className="text-muted-foreground">Max: 10,000 SNYX</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Staking more tokens increases your node's reward potential
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStake}
                disabled={isSubmitting || !stakingAmount || parseFloat(stakingAmount) <= 0}
                className="btn-gradient"
              >
                {isSubmitting ? 'Processing...' : 'Stake'}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="500"
                  min="1"
                  max={node.staked}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-muted-foreground">SNYX</span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Min: 1 SNYX</span>
                <span className="text-muted-foreground">Max: {node.staked.toLocaleString()} SNYX</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Withdrawing tokens will reduce your node's reward potential
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={
                  isSubmitting || 
                  !withdrawAmount || 
                  parseFloat(withdrawAmount) <= 0 || 
                  parseFloat(withdrawAmount) > node.staked
                }
                variant="destructive"
              >
                {isSubmitting ? 'Processing...' : 'Withdraw'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  
  const renderEditNameContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-name">Node Name</Label>
          <Input
            id="node-name"
            placeholder="Enter node name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Public Key</span>
          <span className="font-mono">{shortenAddress(node.pubkey)}</span>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateName}
          disabled={isSubmitting || !nodeName || nodeName === node.name}
        >
          {isSubmitting ? 'Updating...' : 'Update Name'}
        </Button>
      </DialogFooter>
    </div>
  );
  
  const renderPasscodeContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passcode">Node Passcode</Label>
          <Input
            id="passcode"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Setting a passcode makes this node private. Only users with the passcode can discover it.
          </p>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Node</span>
          <span className="font-medium">{node.name}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Public Key</span>
          <span className="font-mono">{shortenAddress(node.pubkey)}</span>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSetPasscode}
          disabled={isSubmitting || passcode === node.passcode}
        >
          {isSubmitting ? 'Updating...' : 'Update Passcode'}
        </Button>
      </DialogFooter>
    </div>
  );
  
  const getDialogTitle = () => {
    switch (type) {
      case 'staking':
        return 'Manage Node Stake';
      case 'passcode':
        return 'Set Node Passcode';
      case 'edit':
        return 'Edit Node Name';
      default:
        return 'Manage Node';
    }
  };
  
  const renderContent = () => {
    switch (type) {
      case 'staking':
        return renderStakingContent();
      case 'passcode':
        return renderPasscodeContent();
      case 'edit':
        return renderEditNameContent();
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
