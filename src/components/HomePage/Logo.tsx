import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Image from "next/image"

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
})

const Logo = () => {
    return (
        <div className="flex items-center gap-x-2">
            <Image
                src="/logo.svg"
                height="40"
                width="40"
                alt="logo"
            />
            <p className={cn(
                "font-semibold",
                font.className
            )}>Slack</p>
        </div>
    )
}

export default Logo