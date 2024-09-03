"use client";

import { useGetChannelById } from "@/features/channels/api/useGetChannelById";
import { useChannelId } from "@/hooks/useChannelId";
import { Loader, TriangleAlert } from "lucide-react";
import ChatInput from "./ChatInput";
import Header from "./Header";

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const { data: channel, isLoading: channelLoading } = useGetChannelById({ channelId });

    if (channelLoading) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="animate-spin size-6 text-muted-foreground" />
            </div>
        )
    }
    if (!channel) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-5" />
                <span className="text-sm text-muted-foreground">Workspace not found</span>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full">
            <Header title={channel.name} />
            <div className="flex-1" />
            <ChatInput
                placeholder={`Message #${channel.name}`}
            />
        </div>
    )
}

export default ChannelIdPage