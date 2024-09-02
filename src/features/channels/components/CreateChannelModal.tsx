import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"
import { useCreateChannel } from "../api/useCreateChannel"
import { useCreateChannelModal } from "../store/useCreateChannelModal"

const CreateChannelModal = () => {
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();
    const [channelName, setChannelName] = useState("");
    const { mutate, isPending } = useCreateChannel();
    const handleClose = () => {
        setChannelName("");
        setOpen(false);
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g,"-").toLowerCase()
        setChannelName(value)        
    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            name: channelName, 
            workspaceId
        },{
            onSuccess: (id) => {
                toast.success("Channel created successfully");
                handleClose();
            },
            onError: () => {
                toast.error("Failed to create a channel")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={channelName}
                        onChange={handleChange}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={100}
                        placeholder="e.g. 'daily-budget' , 'healthy-foods'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}


export default CreateChannelModal