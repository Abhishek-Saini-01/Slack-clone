

import { Button } from "@/components/ui/button";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Info, Search } from "lucide-react";

const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkspaceById({id: workspaceId})
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-12 p-1.5">
        <div className="flex-1" />
        <div className="min-w-[280px] max-[642px] grow-[2] shrink">
            <Button size="sm" className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
                <Search className="start-4 text-white mr-2" />
                <span className="text-white text-xs">Search {data?.name}</span>
            </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
            <Button variant="transparent" size="iconSm">
                <Info className="size-4 text-white" />
            </Button>
        </div>
    </nav>
  )
}

export default Toolbar