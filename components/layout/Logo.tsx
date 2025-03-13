
import { Button } from '@/components/ui/button';
import Image from "next/image"



const Logo = () => {

    return (
        <div className="flex items-center space-x-2">


            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
            >
                <Image

                    src="/X_logo.svg"
                    alt="Twitter"
                    width={21}
                    height={21}
                    onClick={() => window.open("https://twitter.com/AeroNyxNetwork")}

                />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
            >
                <Image
                    src="/telegram.svg"
                    alt="Telegram"
                    width={24}
                    height={24}
                    onClick={() => window.open("https://t.me/AeroNyxNetwork")}
                />
            </Button>
        </div>
    )
}
export default Logo