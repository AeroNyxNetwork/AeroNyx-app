/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-18 15:56:25
 */
'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from "@/components/layout/Sidebar"
require('@solana/wallet-adapter-react-ui/styles.css');
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const network = clusterApiUrl('devnet'); // devnet, mainnet-beta, testnet
  const wallets: any = [
    // new SolflareWalletAdapter(),
  ];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={wallets} autoConnect={false} >

            <div className="flex h-screen">
              <div className="w-72 hidden lg:block">
                <Sidebar ></Sidebar>
              </div>
              <div className="flex-1 min-w-[390px]">
                {children}
              </div>
            </div>
            <Toaster />

          </WalletProvider>
        </ConnectionProvider>

      </QueryClientProvider>
    </ThemeProvider>
  );
}
