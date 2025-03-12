'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TimeRange = '7d' | '30d' | '3m' | 'all';

interface DataPoint {
  date: string;
  nodeDailyReward: number;
  onlineDailyReward: number;
  stakeRewards: number;
}

// Generate mock data for the chart
const generateMockData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    data.push({
      date: dateStr,
      nodeDailyReward: Math.random() * 5 + 2,
      onlineDailyReward: Math.random() * 3 + 1,
      stakeRewards: Math.random() * 4 + 1.5,
    });
  }
  
  return data;
};

export default function EarningsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [data, setData] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Set data based on the selected time range
    let days = 7;
    
    switch (timeRange) {
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '3m':
        days = 90;
        break;
      case 'all':
        days = 180;
        break;
    }
    
    setData(generateMockData(days));
  }, [timeRange]);
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };
  
  return (
    <div className="h-80">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="7d" value={timeRange} onValueChange={handleTimeRangeChange}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="3m">3M</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.5)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 30, 50, 0.9)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="nodeDailyReward" 
            stroke="#7462f7" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Node Rewards"
          />
          <Line 
            type="monotone" 
            dataKey="onlineDailyReward" 
            stroke="#5d4af6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Online Rewards"
          />
          <Line 
            type="monotone" 
            dataKey="stakeRewards" 
            stroke="#8473ff" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Stake Rewards"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
