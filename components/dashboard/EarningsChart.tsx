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
import { API_ENDPOINTS } from "@/components/api"
import { createWalletStore } from "@/store/walletStore"
import axios from 'axios';
import { size, map } from 'lodash';


type FormattedItem = {
  date: string;
} & Record<string, number>;



export default function EarningsChart() {
  let { myNodePubkey } = createWalletStore()
  const [data, setData] = useState<FormattedItem[]>([]);
  useEffect(() => {
    setTimeout(() => {
      getmyChartData()
    }, 2000)
  }, [myNodePubkey])

  const getmyChartData = () => {
    let key = myNodePubkey
    if (!key) {
      return
    }
    axios.get(`${API_ENDPOINTS.GET_MYPOINT_HISTORY}?pubkey=${myNodePubkey}&page_index=0&page_size=31`)
      .then((res) => {
        if (size(res.data.data) > 0) {
          let data = res.data.data
          const result = map(data, item => {
            const obj: any = {};
            obj[item.type] = item.points;
            obj.date = item.data_str;
            return obj;
          })
          setData(result)
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }



  return (
    <div className="h-80">

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
            dataKey="StakeRewards"
            stroke="#7462f7"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="StakeRewards"
          />
          {/* <Line
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
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
