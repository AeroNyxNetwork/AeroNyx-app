

/*
 * @Description: 
 * @Date: 2025-03-19 09:55:55
 * @LastEditTime: 2025-03-24 17:58:25
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
import { MyNode_Deposis } from "@/components/contract/MyNode_Deposis"
import { MyNode_Withdraw } from "@/components/contract/MyNode_Withdraw"
import { useToastStore } from "@/store/useToastStore";
import { createWalletStore } from "@/store/walletStore"
import { useNodeStore } from "@/store/nodeStore"
interface Staking {
    key: string,
    isOpen: boolean
}

interface DownloadModalProps {
    isOpen: Staking;
    onClose: () => void;
}

export default function MyNodesStaking({ isOpen, onClose }: DownloadModalProps) {
    const { balanceNumber, fetchBalance } = createWalletStore()
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
            fetchBalance(publicKey);
            onClose();
            setLoading(false);
        } else {
            useToastStore.getState().showToast("error", result.msg);
            setLoading(false);
        }

    };
    // Deposis
    const Deposis = async (): Promise<void> => {
        if ((balanceNumber ?? 0) < stakeAmount) {
            useToastStore.getState().showToast("error", "Insufficient balance");
            return;
        }
        if (!isOpen.key) {
            return
        }
        if (publicKey && wallet) {
            await executeTransaction(
                () => MyNode_Deposis(wallet, publicKey, stakeAmount, isOpen.key),
                setDeposisLoading
            );
        }



    };
    // Withdraw
    const Withdraw = async (): Promise<void> => {
        if (!isOpen.key) {
            return
        }
        if (publicKey && wallet) {
            await executeTransaction(
                () => MyNode_Withdraw(wallet, publicKey, stakeAmount, isOpen.key),
                setWithdrawisLoading
            );
        }

    };


    return (
        <Dialog open={isOpen.isOpen} onOpenChange={onClose}  >
            <DialogContent className=" w-full min-w-360 sm:max-w-md md:max-w-2xl p-6 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-gray-700">
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center">
                        <AeroNyxLogo className="h-16 w-16" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold gradient-text">
                        My Nodes Manage Stake
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
                        onClick={() => setStakeAmount((balanceNumber ?? 0))}
                        className="h-8 text-xs"
                        disabled={(balanceNumber ?? 0) < 500}
                    >
                        MAX
                    </Button>
                </div>
                <div className="py-4">
                    <div className="mb-2 text-sm text-white text-right">Balance <span style={{ fontSize: "20px" }}>
                        {(balanceNumber ?? 0)}</span> SNYX</div>
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



