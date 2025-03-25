/*
 * @Description: 
 * @Date: 2025-03-13 14:07:03
 * @LastEditTime: 2025-03-25 12:02:23
 */


import { Button } from '@/components/ui/button';
import { createWalletStore } from "@/store/walletStore";
import { API_ENDPOINTS } from "@/components/api"
import { useToastStore } from "@/store/useToastStore";
import { CopyData } from "@/lib/utils"
import axios from 'axios';

const GetInvitationCode = () => {
    const { balanceNumber, fetchBalance, myNodePubkey } = createWalletStore();



    const CopyReferrallink = () => {
        if (!myNodePubkey) {
            useToastStore.getState().showToast("warning", "Download AeroNyx client activation invitation code");
            return
        }
        axios.get(`${API_ENDPOINTS.GET_NODD_INVITE_INFO}?pubkey=${myNodePubkey}`)
            .then((res) => {
                CopyData(`This is the invitation ${res.data.data.invite_code} for my AeroNyx privacy client. Visit https://aeronyx.network or AppStore to download and experience it! Protect your Internet security and privacy immediately.`)
            }).catch((err) => {
                useToastStore.getState().showToast("error", "error");
            })
    }


    return (
        <Button onClick={() => CopyReferrallink()} className="btn-gradient group relative flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-transform transform hover:scale-105 shadow-md">
            Share with friends
        </Button>
    )
}


export default GetInvitationCode