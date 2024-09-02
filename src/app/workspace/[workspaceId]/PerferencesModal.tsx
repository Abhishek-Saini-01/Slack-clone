
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/useRemoveWorkspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace";
import { useConfirm } from "@/hooks/useConfirm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface PreferencesProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}
const PerferencesModal = ({
    initialValue,
    open,
    setOpen
}: PreferencesProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is permanent");

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const handleEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess() {
                toast.success("Workspace name updated 🚀")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace name ❌")
            },
        })
    }
    const handleRemove = async () => {
        const ok = await confirm();
        if(!ok) return;

        removeWorkspace({
            id: workspaceId
        }, {
            onSuccess() {
                toast.success("Workspace removed successfully")
                router.replace("/");
            },
            onError: () => {
                toast.error("Failed to removed workspace ❌")
            },
        })
    }



    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Workspace name
                                        </p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                    </div>
                                    <p className="text-sm" >{value}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this workspace
                                    </DialogTitle>
                                    <form onSubmit={handleEdit} className="space-y-4">
                                        <Input
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            disabled={isUpdatingWorkspace}
                                            required
                                            autoFocus
                                            minLength={3}
                                            maxLength={100}
                                            placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    disabled={isUpdatingWorkspace}
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={isUpdatingWorkspace}
                                            >Save</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <button
                            disabled={false}
                            onClick={handleRemove}
                            className="flex items-center gap-x-5 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                        >
                            <Trash className="size-4" />
                            <p className="text-sm font-semibold">Delete workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PerferencesModal