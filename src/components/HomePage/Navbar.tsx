"use client"


import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Logo from "./Logo";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div className={cn(
            "z-50 bg-background  fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm drop-shadow-md"
        )}>
            <Logo />

            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
            <Button className="bg-[#481349] hover:bg-[#481349]/80" asChild>
                <Link href="/auth">
                    Get Started
                </Link>
            </Button>

            </div>
        </div>
    )
}

export default Navbar