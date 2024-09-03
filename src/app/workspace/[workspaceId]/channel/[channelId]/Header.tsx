import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRemoveChannel } from "@/features/channels/api/useRemoveChannel"
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel"
import { useCurrentMember } from "@/features/members/api/useCurrentMember"
import { useChannelId } from "@/hooks/useChannelId"
import { useConfirm } from "@/hooks/useConfirm"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { DialogClose } from "@radix-ui/react-dialog"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { toast } from "sonner"

interface HeaderProps {
    title: string
}
const Header = ({ title }: HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is permanent");

    const { data: member } = useCurrentMember({ workspaceId });
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setValue(value)
    }

    const handleOpen = (value: boolean) => {
        if (member?.role !== "admin") return;
        setEditOpen(value);
    }

    const handleEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateChannel({
            channelId,
            name: value
        }, {
            onSuccess() {
                toast.success("Channel name updated 🚀")
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update Channel name ❌")
            },
        })
    }
    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeChannel({
            channelId
        }, {
            onSuccess() {
                toast.success("Channel removed successfully")
                router.replace(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to removed Channel ❌")
            },
        })
    }
    return (
        <>
            <ConfirmDialog />
            <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-lg font-semibold px-2 overflow-hidden w-auto"
                            size="sm"
                        >
                            <span className="truncate"># {title}</span>
                            <FaChevronDown className="size-2.5 ml-2" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                        <DialogHeader className="p-4 border-b bg-white">
                            <DialogTitle># {title}</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 pb-4 flex flex-col gap-y-2">
                            <Dialog open={editOpen} onOpenChange={handleOpen}>
                                <DialogTrigger asChild>
                                    <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">Channel name</p>
                                            {member?.role === "admin" && (
                                                <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                            )}
                                        </div>
                                        <p className="text-sm"># {title}</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Rename this channel
                                        </DialogTitle>
                                        <form onSubmit={handleEdit} className="space-y-4">
                                            <Input
                                                value={value}
                                                onChange={handleChange}
                                                disabled={isUpdatingChannel}
                                                required
                                                autoFocus
                                                minLength={3}
                                                maxLength={100}
                                                placeholder="e.g. 'daily-budget' , 'healthy-foods'"
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button
                                                        variant="outline"
                                                        disabled={isUpdatingChannel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    type="submit"
                                                    disabled={isUpdatingChannel}
                                                >Save</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            {member?.role === "admin" && (
                                <button
                                    disabled={isRemovingChannel}
                                    onClick={handleRemove}
                                    className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                                >
                                    <Trash className="size-4" />
                                    <p className="text-sm font-semibold">Delete channel</p>
                                </button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default Header