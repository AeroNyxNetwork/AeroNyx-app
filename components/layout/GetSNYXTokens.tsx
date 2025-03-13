/*
 * @Description: 
 * @Date: 2025-03-13 13:52:15
 * @LastEditTime: 2025-03-13 14:45:27
 */

import { Button } from '@/components/ui/button';
import Image from "next/image"

const GetSNYXTokens = () => {
    return (
        <Button
            className="btn-gradient group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto
            mt-4 sm:mt-0
            "
        >
            <div className="flex items-center space-x-3">
                <Image src="/soon.png" alt="SNYX" width={60} height={30} />
                <div>Get SNYX tokens</div>
                <Image src="/image22.png" alt="" width={30} height={20} />
            </div>
        </Button>
    )


}

export default GetSNYXTokens