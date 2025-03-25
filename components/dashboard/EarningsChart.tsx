'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { API_ENDPOINTS } from "@/components/api"
import { createWalletStore } from "@/store/walletStore"
import axios from 'axios';
import { size, map } from 'lodash';
import { Server, Loader } from 'lucide-react';

type FormattedItem = {
  date: string;
} & Record<string, number>;



export default function EarningsChart() {
  const { myNodePubkey } = createWalletStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<FormattedItem[]>([]);

  const getMyChartData = useCallback(async () => {
    if (!myNodePubkey) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.GET_MYPOINT_HISTORY}?pubkey=${myNodePubkey}&page_index=0&page_size=31`
      );
      const responseData = response.data?.data || [];
      if (size(responseData) > 0) {
        const formattedData = map(responseData, (item) => ({
          date: item.data_str,
          [item.type]: item.points,
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [myNodePubkey]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      getMyChartData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [myNodePubkey, getMyChartData]);



  return (
    <div className="h-80">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader className="w-7 h-7 mt-20 animate-spin text-blue-400" />
        </div>
      ) : size(data) < 1 ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <Server className="h-10 w-10 mb-2 opacity-40" />
          <p>No nodes found</p>
          <p className="text-sm">Deploy a node to get started</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              dataKey="StakeRewards"
              stroke="#7462f7"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="StakeRewards"
            />
            {/*
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
        */}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
