"use client";

import { useMemberId } from "@/hooks/useMemberId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();


  // if (isPending) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <Loader className="size-6 animate-spin text-muted-foreground" />
  //     </div>
  //   )
  // }

  // if (!data) {
  //   return (
  //     <div className="flex flex-col gap-y-2 h-full items-center justify-center">
  //       <AlertTriangle className="size-6  text-muted-foreground" />
  //       <span className="text-sm text-muted-foreground" >Conversation not found</span>
  //     </div>
  //   )
  // }

  return (
    <div>MemberIdPage : {JSON.stringify({ memberId, workspaceId })}</div>
  )
}

export default MemberIdPage