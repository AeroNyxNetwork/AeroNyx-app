'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Menu,
  X,
  Search,
  Twitter,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import UserIP from '@/components/dashboard/UserIP';
import Logo from "@/components/layout/Logo"
import GetSNYXTokens from "@/components/layout/GetSNYXTokens"
import GetInvitationCode from "@/components/layout/GetInvitationCode"
import { API_ENDPOINTS } from "@/components/api"
import axios from 'axios';
import { createWalletStore } from '@/store/walletStore';



interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const { isConnected, account, balance, connect, disconnect } = useWallet();
  const [showUserIP, setShowUserIP] = useState(true);
  let [aeroNyxPubkey, setAeroNyxPubkey] = useState<string>("")
  // Format the wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  useEffect(() => {
    getNodePubkey()
  }, [])


  const getNodePubkey = async () => {
    let pubkey = "";
    try {
      const res = await axios.get(API_ENDPOINTS.MY_NODES_AUTH);
      pubkey = res.data.result == 1 ? res.data.data.pubkey : "";
    } catch (error) {
      pubkey = "";
    }
    setAeroNyxPubkey(pubkey);
    createWalletStore.getState().setMyNodePubkey(pubkey);
  };





  return (
    <header className="glass-navbar w-full max-w-full p-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        {/* Left Side - Menu Button */}
        <div className="flex items-center">
          {showMenuButton && (
            <Button
              variant="ghost"
              className="mr-4 lg:hidden"
              size="icon"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between w-full">

          <div className="flex items-center space-x-2 ">
            {!showMenuButton && (
              <GetInvitationCode />
            )}
            <div className="hidden sm:block">
              <GetSNYXTokens />
            </div>
          </div>


          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Logo />

            {/* Connect/Wallet Menu */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-700 text-white">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-primary text-white text-xs">
                          {account?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{formatAddress(account)}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex justify-between">
                    <span>Balance</span>
                    <span className="font-medium text-primary">{balance} SNYX</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open("https://explorer.soon.network", "_blank")}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>View on Explorer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnect}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connect}
                className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
                <div className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8V7.2C18 6.0799 18 5.51984 17.782 5.09202C17.5903 4.71569 17.2843 4.40973 16.908 4.21799C16.4802 4 15.9201 4 14.8 4H9.2C8.07989 4 7.51984 4 7.09202 4.21799C6.71569 4.40973 6.40973 4.71569 6.21799 5.09202C6 5.51984 6 6.0799 6 7.2V8M6 8H18M6 8V16.8C6 17.9201 6 18.4802 6.21799 18.908C6.40973 19.2843 6.71569 19.5903 7.09202 19.782C7.51984 20 8.07989 20 9.2 20H14.8C15.9201 20 16.4802 20 16.908 19.782C17.2843 19.5903 17.5903 19.2843 17.782 18.908C18 18.4802 18 17.9201 18 16.8V8"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path d="M16 16C16 14.9391 15.5786 13.9217 14.8284 13.1716C14.0783 12.4214 13.0609 12 12 12C10.9391 12 9.92172 12.4214 9.17157 13.1716C8.42143 13.9217 8 14.9391 8 16"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium">Connect OKX Wallet</span>
                </div>
              </Button>
            )}

            {
              aeroNyxPubkey &&
              <Button variant="outline" className="border-gray-700 text-white space-x-2  hidden  lg:flex" >
                <Image src="/aeronyx_logo1.png" alt="" width={24} height={24} />
                <div>
                  {
                    formatAddress(aeroNyxPubkey)
                  }
                </div>
              </Button>
            }


          </div>


        </div>
      </div>
      <div className="block sm:hidden">
        <GetSNYXTokens />
      </div>
      {/* User IP Info Bar */}
      {showUserIP && (
        <div className="mt-4">
          <UserIP onClose={() => setShowUserIP(false)} />
        </div>
      )}



    </header>
  );
}
