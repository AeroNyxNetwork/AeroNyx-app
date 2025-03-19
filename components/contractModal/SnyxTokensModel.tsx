/*
 * @Description: 
 * @Date: 2025-03-19 09:55:55
 * @LastEditTime: 2025-03-19 19:03:39
 */
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AeroNyxLogo } from '@/components/ui/logo';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenAddress, OpenPage } from "@/lib/utils"
import { GetSNYXTokens } from "@/components/contract/getSNYXTokens"
import { useToastStore } from "@/store/useToastStore";
import { createWalletStore } from "@/store/walletStore"


interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SnyxTokensModel({ isOpen, onClose }: DownloadModalProps) {
    const { publicKey, wallet } = useWallet();


    const Confirm = async (): Promise<void> => {
        const result = await GetSNYXTokens(wallet, publicKey); // Call the token request function
        if (result.code === "success") {
            useToastStore.getState().showToast("success", "success");
            createWalletStore.getState().fetchBalance(publicKey)
            onClose()
        } else {
            useToastStore.getState().showToast("error", result.msg);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-2xl p-6 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-gray-700">
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center">
                        <AeroNyxLogo className="h-16 w-16" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold gradient-text">
                        Get test tokens
                    </DialogTitle>

                </DialogHeader>
                <Input
                    disabled
                    height="50px"
                    placeholder={publicKey ? shortenAddress(publicKey?.toString(), 10) : ''}
                    className="w-full mt-4 p-3 rounded-lg bg-white/20 border border-white/10"
                />
                <div className="py-4">
                    <div
                        className="mb-2 text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200"
                        onClick={() => OpenPage("https://docs.aeronyx.network/aeronyx-faq-and-community-guide/interacting-with-aeronyx-wallet-setup-guide")}
                    >
                        How to link to OKX wallet?
                    </div>
                    <div className="mb-2 text-sm text-white">You can receive 500 SNYX at a time.</div>
                    <div className="mb-2 text-sm text-white">You can receive it once every 2 hours.</div>
                    <div className="mb-2 text-sm text-white">12 times per day.</div>
                </div>
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => Confirm()}
                        className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto
                          mt-4 sm:mt-0 "
                        style={{ width: '200px' }}
                    >
                        Confirm
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}
