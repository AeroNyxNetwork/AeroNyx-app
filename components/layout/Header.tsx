'use client';

import { useState } from 'react';
import { 
  Bell, 
  Menu, 
  X,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useWallet } from '@/components/providers/WalletProvider';
import { Button } from '@/components/ui/button';
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

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const { isConnected, account, balance, connect, disconnect } = useWallet();
  const [showUserIP, setShowUserIP] = useState(true);
  
  // Format the wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <header className="glass-navbar p-4 border-b border-gray-800">
      <div className="flex items-center justify-between">
        {/* Left Side - Menu Button + Search */}
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
          
          <div className="hidden md:flex items-center bg-gray-900 rounded-lg border border-gray-700 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search..." 
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        
        {/* Right Side - Notifications + Wallet */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          
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
            <Button onClick={connect} className="btn-gradient">
              Connect Wallet
            </Button>
          )}
        </div>
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
