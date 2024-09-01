"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceById({id: workspaceId})
  return (
    <div>Data: {JSON.stringify(data)} </div>
  )
}

export default WorkspaceIdPage;