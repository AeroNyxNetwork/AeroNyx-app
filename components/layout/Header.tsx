"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Menu,
  ArrowLeft,
  X,
  Search,
  Twitter,
  Send,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UserIP from "@/components/dashboard/UserIP";
import Logo from "@/components/layout/Logo";
import GetSNYXTokens from "@/components/layout/GetSNYXTokens";
import GetInvitationCode from "@/components/layout/GetInvitationCode";
import { API_ENDPOINTS } from "@/components/api";
import axios from "axios";
import { createWalletStore } from "@/store/walletStore";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from 'next/navigation';
interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = true }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  const { connect, disconnect, connected, publicKey, wallet, select } =
    useWallet();
  const [showUserIP, setShowUserIP] = useState(true);
  let [aeroNyxPubkey, setAeroNyxPubkey] = useState<string>("");
  // Format the wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    getNodePubkey();
  }, []);

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

  useEffect(() => {
    if (wallet) {
      connect();
    }
  }, [wallet]);

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
          {
            pathname !== "/register-node" ?
              <div className="flex items-center space-x-2 ">
                {!showMenuButton && <GetInvitationCode />}
                <div className="hidden sm:block">
                  <GetSNYXTokens />
                </div>
              </div>
              :
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2 "
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </Button>
          }


          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Logo />

            {/* Connect/Wallet Menu */}

            <WalletModalProvider>
              {publicKey ? (
                <Button
                  variant="outline"
                  className="border-gray-700 text-white"
                >
                  <WalletMultiButtonDynamic
                    style={{
                      background: "rgba(0,0,0,0)",
                      height: "40px",
                      padding: "0 10px",
                      borderRadius: "10px",
                      width: "200px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  ></WalletMultiButtonDynamic>
                </Button>
              ) : (
                <Button
                  onClick={connect}
                  className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5"
                >
                  <WalletMultiButtonDynamic
                    style={{
                      background: "rgba(0,0,0,0)",
                      height: "40px",
                      padding: "0 10px",
                      borderRadius: "10px",
                      width: "220px",
                      display: "flex",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
                    <div className="relative z-10 flex items-center">
                      <span className="font-medium">Connect OKX Wallet</span>
                    </div>
                  </WalletMultiButtonDynamic>
                </Button>
              )}
            </WalletModalProvider>

            {aeroNyxPubkey && (
              <Button
                variant="outline"
                className="border-gray-700 text-white space-x-2  hidden  lg:flex"
              >
                <Image src="/aeronyx_logo1.png" alt="" width={24} height={24} />
                <div>{formatAddress(aeroNyxPubkey)}</div>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="block sm:hidden">
        <GetSNYXTokens />
      </div>
      {/* User IP Info Bar */}
      {showUserIP && pathname !== "/register-node" && (
        <div className="mt-4">
          <UserIP onClose={() => setShowUserIP(false)} />
        </div>
      )}
    </header>
  );
}
