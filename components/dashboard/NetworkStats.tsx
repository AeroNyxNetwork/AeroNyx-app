'use client';

import { useEffect, useState } from 'react';
import { 
  Network, 
  CircleDollarSign, 
  LineChart, 
  ArrowUpRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface NetworkStatsProps {
  stats: {
    totalNodes: number;
    activeNodes: number;
    totalStaked: number;
    averageRewards: number;
  };
  isLoading?: boolean;
}

export default function NetworkStats({ stats, isLoading = false }: NetworkStatsProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(stats.activeNodes / stats.totalNodes * 100 || 0);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [stats.activeNodes, stats.totalNodes]);
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Network Overview</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
            Explorer
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Nodes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="rounded-full p-1.5 bg-primary bg-opacity-20 mr-2">
                <Network className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Network Nodes</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-20 bg-gray-800" />
            ) : (
              <span className="text-lg font-bold">{stats.totalNodes.toLocaleString()}</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Active ({stats.activeNodes.toLocaleString()})</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
        
        {/* Total Staked */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="rounded-full p-1.5 bg-primary bg-opacity-20 mr-2">
                <CircleDollarSign className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Total Staked</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-28 bg-gray-800" />
            ) : (
              <span className="text-lg font-bold">{stats.totalStaked.toLocaleString()} SNYX</span>
            )}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">Network Security</span>
            <span className="text-green-500">Very Strong</span>
          </div>
        </div>
        
        {/* Average Rewards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="rounded-full p-1.5 bg-primary bg-opacity-20 mr-2">
                <LineChart className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Average APY</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-16 bg-gray-800" />
            ) : (
              <span className="text-lg font-bold">{stats.averageRewards.toFixed(1)}%</span>
            )}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">Varies by node type</span>
            <span className="text-primary">Details</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
