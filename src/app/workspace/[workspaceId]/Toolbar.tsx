

import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Info, Search } from "lucide-react";
import { useState } from "react";

const Toolbar = () => {

    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkspaceById({ id: workspaceId })
    const [open, setOpen] = useState(false);
    return (
        <nav className="bg-[#481349] flex items-center justify-between h-12 pt-3 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button onClick={()=>setOpen(true)} size="sm"  className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2">
                    <Search className="start-4 text-white mr-2" />
                    <span className="text-white text-xs">Search {data?.name}</span>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen} >
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>One</CommandItem>

                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">

                            <CommandItem>Two</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>

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