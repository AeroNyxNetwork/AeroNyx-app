/*
 * @Description: 
 * @Date: 2025-03-13 10:57:54
 * @LastEditTime: 2025-03-13 14:04:13
 */
'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from "@/components/layout/Sidebar"
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}
