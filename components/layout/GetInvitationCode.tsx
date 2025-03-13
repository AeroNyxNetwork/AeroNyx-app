/*
 * @Description: 
 * @Date: 2025-03-13 14:07:03
 * @LastEditTime: 2025-03-13 14:21:18
 */


import { Button } from '@/components/ui/button';
const GetInvitationCode = () => {
    return (
        // <div className="hidden lg:flex items-center justify-between bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg w-full max-w-sm">
        //     <div className="text-lg font-semibold">Referrals: 0</div>

        // </div>
        <Button className="btn-gradient group relative flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-transform transform hover:scale-105 shadow-md">
            Share with friends
        </Button>
    )
}


export default GetInvitationCode