"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/useCreateOrGetConversation";
import { useMemberId } from "@/hooks/useMemberId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Conversation from "./Conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] = useState<Id<"conversations">|null>(null);
  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    }, {
      onSuccess(id) {
        setConversationId(id);
      },
      onError() {
          toast.error("Failed to create or get conversation");
      },
    })
  },[memberId, workspaceId, mutate])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground" >Conversation not found</span>
      </div>
    )
  }

  return (
    <Conversation
      id={conversationId}
    />
  )
}

export default MemberIdPage