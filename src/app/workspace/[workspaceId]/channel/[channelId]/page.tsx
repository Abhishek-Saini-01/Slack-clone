"use client";

import MessageList from "@/components/MessageList";
import { useGetChannelById } from "@/features/channels/api/useGetChannelById";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { useChannelId } from "@/hooks/useChannelId";
import { Loader, TriangleAlert } from "lucide-react";
import ChatInput from "./ChatInput";
import Header from "./Header";

const ChannelIdPage = () => {
    const channelId = useChannelId();


    const { results, status, loadMore } = useGetMessages({channelId});
    const { data: channel, isLoading: channelLoading } = useGetChannelById({ channelId });
    
    if (channelLoading || status === "LoadingFirstPage") {
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
            <MessageList 
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "Exhausted"}
            />
            <ChatInput
                placeholder={`Message #${channel.name}`}
            />
        </div>
    )
}

export default ChannelIdPage