

/*
 * @Description: 
 * @Date: 2025-03-19 09:55:55
 * @LastEditTime: 2025-03-21 18:47:27
 */
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from "lucide-react";
import { Button } from '@/components/ui/button';
import { AeroNyxLogo } from '@/components/ui/logo';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useWallet } from "@solana/wallet-adapter-react";
import { shortenAddress, OpenPage } from "@/lib/utils"
import { D_deposit } from "@/components/contract/D_deposit"
import { D_withdraw } from "@/components/contract/D_withdraw"
import { useToastStore } from "@/store/useToastStore";
import { createWalletStore } from "@/store/walletStore"
import { useNodeStore } from "@/store/nodeStore"
interface AllNode {
    city: string;
    initialized: number;
    latitude: number;
    longitude: number;
    name: string;
    offchain_ip: string;
    offline: number;
    owner: string;
    serverkey: string;
    stake: number;
    total: number;
    total_delegators: number;
}
interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    clickData: AllNode | null
}

export default function AllNodesManageStake({ isOpen, onClose, clickData }: DownloadModalProps) {
    const { publicKey, wallet } = useWallet();
    const [stakeAmount, setStakeAmount] = useState<number>(500)
    const [deposisLoading, setDeposisLoading] = useState<boolean>(false)
    const [withdrawisLoading, setWithdrawisLoading] = useState<boolean>(false)
    const executeTransaction = async (
        operation: () => Promise<{ code: string; msg: string }>,
        setLoading: (isLoading: boolean) => void
    ): Promise<void> => {
        setLoading(true);
        const result = await operation();
        if (result.code === "success") {
            useNodeStore.getState().fetchAllNetworkNodes();
            useToastStore.getState().showToast("success", "success");
            createWalletStore.getState().fetchBalance(publicKey);
            onClose();
            setLoading(false);
        } else {
            useToastStore.getState().showToast("error", result.msg);
            setLoading(false);
        }

    };
    // Deposis
    const Deposis = async (): Promise<void> => {
        if ((createWalletStore.getState().balanceNumber ?? 0) < stakeAmount) {
            useToastStore.getState().showToast("error", "Insufficient balance");
            return;
        }

        if (publicKey && wallet && clickData) {
            await executeTransaction(
                () => D_deposit(wallet, publicKey, stakeAmount, clickData.serverkey, clickData.owner),
                setDeposisLoading
            );
        }



    };
    // Withdraw
    const Withdraw = async (): Promise<void> => {
        if (publicKey && wallet && clickData) {
            await executeTransaction(
                () => D_withdraw(wallet, publicKey, stakeAmount, clickData.serverkey, clickData.owner),
                setWithdrawisLoading
            );
        }

    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}  >
            <DialogContent className=" w-full min-w-360 sm:max-w-md md:max-w-2xl p-6 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-gray-700">
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center">
                        <AeroNyxLogo className="h-16 w-16" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold gradient-text">
                        Manage Stake
                    </DialogTitle>

                </DialogHeader>
                <div className="flex items-center">
                    <Input
                        type="number"
                        min={500}
                        max={10000}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Number(e.target.value))}
                        className="bg-background/30 border-white/10"
                    />
                    <span className="mx-2">SNYX</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStakeAmount((createWalletStore.getState().balanceNumber ?? 0))}
                        className="h-8 text-xs"
                        disabled={(createWalletStore.getState().balanceNumber ?? 0) < 500}
                    >
                        MAX
                    </Button>
                </div>
                <div className="py-4">
                    <div className="mb-2 text-sm text-white text-right">Balance <span style={{ fontSize: "20px" }}>
                        {(createWalletStore.getState().balanceNumber ?? 0)}</span> SNYX</div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 md:flex md:justify-center md:space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => Deposis()}
                        className="sm:w-auto mx-auto md:mx-0  btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto mt-4 sm:mt-0"
                        style={{ width: '200px' }}
                        disabled={deposisLoading || withdrawisLoading}
                    >
                        {deposisLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Deposis"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => Withdraw()}
                        className="sm:w-auto mx-auto md:mx-0 btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto mt-4 sm:mt-0"
                        style={{ width: '200px' }}
                        disabled={deposisLoading || withdrawisLoading}
                    >
                        {withdrawisLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Withdraw"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}



