
/*
 * @Description: 
 * @Date: 2025-03-19 09:55:55
 * @LastEditTime: 2025-03-24 18:00:15
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
import { Loader } from "lucide-react";
import { Input } from '@/components/ui/input';
import { useWallet } from "@solana/wallet-adapter-react";
import { useToastStore } from "@/store/useToastStore";
import axios from 'axios';
import { API_ENDPOINTS } from "@/components/api";
import { size } from 'lodash';
import { useNodeStore } from "@/store/nodeStore";

interface Passcode {
    key: string | null,
    isOpen: boolean
}

interface DownloadModalProps {
    isOpen: Passcode;
    onClose: () => void;
}

export default function PasswordDialog({ isOpen, onClose }: DownloadModalProps) {
    const [code, setCode] = useState(null)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const { wallet } = useWallet();

    const Confirm = async (): Promise<void> => {
        if (size(code) < 1) {
            useToastStore.getState().showToast("error", "Please enter passcode");
            return
        }
        setConfirmLoading(true)
        axios.get(`${API_ENDPOINTS.PASSCODE}?mechine_pubkey=${isOpen.key}&passcode=${code}`)
            .then((res: any) => {
                if (res?.data?.success == 1) {
                    onClose()
                    setConfirmLoading(false)
                    useToastStore.getState().showToast("success", "success");
                    useNodeStore.getState().fetchMyNodes(wallet)
                }
            })
            .catch((error) => {
                useToastStore.getState().showToast("error", error);
                setConfirmLoading(false)
            });
    };


    return (
        <Dialog open={isOpen.isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-2xl p-6 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-gray-700">
                <DialogHeader className="space-y-4">
                    <div className="flex justify-center">
                        <AeroNyxLogo className="h-16 w-16" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold gradient-text">
                        Set passcode
                    </DialogTitle>

                </DialogHeader>
                <Input
                    onChange={(e: any) => setCode(e.target.value)}
                    height="50px"
                    placeholder='passcode'
                    className="w-full mt-4 p-3 rounded-lg bg-white/20 border border-white/10"
                />
                <div className="mb-2 text-sm text-white">Why do I need to set a node passcode?</div>
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => Confirm()}
                        className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto
                          mt-4 sm:mt-0 "
                        style={{ width: '200px' }}
                        disabled={confirmLoading}
                    >
                        {confirmLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Confirm"}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}













