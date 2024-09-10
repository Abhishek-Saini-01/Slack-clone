"use client"


import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"


const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Made for people. <span className="text-[#611F69]">Built for productivity.</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Slack is free to try for as long as you like
            </h3>
            <Button className="bg-[#481349] hover:bg-[#481349]/80" asChild>
                <Link href="/auth">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
            </Button>

        </div>
    )
}

export default Heading