/*
 * @Description: 
 * @Date: 2025-03-13 13:52:15
 * @LastEditTime: 2025-03-19 13:23:04
 */

import { Button } from '@/components/ui/button';
import Image from "next/image"
import { GetSNYXTokens } from "@/components/contract/getSNYXTokens"
import { useWallet } from '@/components/providers/WalletProvider';
import SnyxTokensModel from "@/components/contractModal/SnyxTokensModel"
import { useState } from 'react';

const GetSNYXTokensButton = () => {
    const [showSnyxTokensModel, setShowSnyxTokensModel] = useState<boolean>(false);

    return (
        <>
            <Button
                className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto
            mt-4 sm:mt-0
            "
            >
                <div className="flex items-center space-x-3" onClick={() => setShowSnyxTokensModel(true)}>
                    <Image src="/soon.png" alt="SNYX" width={60} height={30} />
                    <div>Get SNYX tokens</div>
                    <Image src="/image22.png" alt="" width={30} height={20} />
                </div>
            </Button>
            {
                showSnyxTokensModel &&
                <SnyxTokensModel
                    isOpen={showSnyxTokensModel}
                    onClose={() => setShowSnyxTokensModel(false)}
                />
            }
        </>

    )


}

export default GetSNYXTokensButton