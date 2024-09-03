"use client";

import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [open , setOpen] = useCreateChannelModal();

  const { data:workspace, isLoading:workspaceLoading } = useGetWorkspaceById({id: workspaceId});
  const { data:channels, isLoading:channelLoading } = useGetChannels({workspaceId});
  const {data:member, isLoading:memberLoading} = useCurrentMember({workspaceId});

  const channelId = useMemo(()=> channels?.[0]?._id ,[channels])
  const isAdmin = useMemo(()=> member?.role === "admin" ,[member?.role])
  useEffect(()=>{
    if(workspaceLoading || channelLoading || memberLoading || !member ||!workspace) return;

    if(channelId){
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if(!open && isAdmin) {
      setOpen(true);
    }
  },[channelId, channelLoading, workspace, workspaceLoading, open, setOpen,router,isAdmin, workspaceId ,member, memberLoading]);

  if(workspaceLoading || channelLoading || memberLoading){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    )
  }
  if(!workspace || !member){
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-5"/>
        <span className="text-sm text-muted-foreground">Workspace not found</span>
      </div>
    )
  }

   return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-5"/>
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  )
}

export default WorkspaceIdPage;