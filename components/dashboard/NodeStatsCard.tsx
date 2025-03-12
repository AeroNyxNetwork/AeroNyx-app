'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface NodeStatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export default function NodeStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false
}: NodeStatsCardProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            
            {loading ? (
              <Skeleton className="h-8 w-32 bg-gray-800" />
            ) : (
              <h3 className="text-2xl font-bold">{value}</h3>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          
          <div className="rounded-full p-2 bg-primary bg-opacity-20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {trend && trend.value > 0 && (
          <div className="mt-4 flex items-center">
            <div
              className={cn(
                "text-xs font-medium mr-2 flex items-center",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span
                className={cn(
                  "mr-1 text-lg",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {trend.value}%
            </div>
            <p className="text-xs text-muted-foreground">vs. last week</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
