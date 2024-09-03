"use client"

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfoById } from "@/features/workspaces/api/useGetWorkspaceInfoById";
import { useJoin } from "@/features/workspaces/api/useJoin";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useJoin();
    const { data, isLoading } = useGetWorkspaceInfoById({ id: workspaceId });
    const isMember = useMemo(()=>data?.isMember,[data?.isMember]);
    useEffect(()=>{
        if(isMember){
            router.push(`/workspace/${workspaceId}`)
        }
    },[isMember, router, workspaceId])

    if(isLoading) {
        return(
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin size-6 text-muted-foreground"/>
            </div>
        )
    }

    const handleComplete = (value: string) => {
        mutate({workspaceId, joinCode: value}, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success("Workspace joined successfully.")                
            },
            onError: () => {
                toast.error("Failed to join workspace.")
            }
        })
    }

    return (
        <div
            className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md"
        >
            <Image
                src="/logo.svg"
                alt="logo"
                width={60}
                height={60}
            />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center ">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the join code to get started</p>
                </div>

                <VerificationInput 
                    onComplete={handleComplete}
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black",
                        characterFilled: "bg-white text-black"
                    }}
                    length={6}
                    autoFocus
                />
            </div>
            <div className="flex gap-x-4">
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                    >
                        <Link
                            href="/"
                        >
                            Back to home
                        </Link>
                    </Button>
            </div>
        </div>
    )
}

export default JoinPage