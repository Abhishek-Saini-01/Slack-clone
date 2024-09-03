"use client";

import UserButton from "@/features/auth/components/UserButton";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data])
  useEffect(() => {
    if (isLoading) {
      return;
    };
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router])
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center h-full">
      <UserButton />
      <Loader className="animate-spin size-9 text-muted-foreground" />
      <p className="text-sm text-gray-500 font-semibold">Loading your workspace....</p>
    </div>
  );
}
