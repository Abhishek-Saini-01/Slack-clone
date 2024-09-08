
import { useCurrentMember } from '@/features/members/api/useCurrentMember'
import { useGetMemberById } from '@/features/members/api/useGetMemberById'
import { useRemoveMember } from '@/features/members/api/useRemoveMember'
import { useUpdateMember } from '@/features/members/api/useUpdateMember'
import { useConfirm } from '@/hooks/useConfirm'
import { useWorkspaceId } from '@/hooks/useWorkspaceId'
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Id } from '../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Separator } from './ui/separator'
interface ProfileProps {
    memberId: Id<"members">
    onClose: () => void
}
export const Profile = ({
    memberId,
    onClose
}: ProfileProps) => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const [LeaveDialog, confirmLeave] = useConfirm(
        "Leave Workspace",
        "Are you sure you want to leave this workspace?"
    );
    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove member",
        "Are you sure you want to remove this member?"
    )
    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change user role",
        "Are you sure you want to change this member's role?"
    )
    const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({ workspaceId });
    const { data: member, isLoading: isMemberLoading } = useGetMemberById({ memberId });
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
    const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember();

    const onRemove = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        removeMember({ memberId }, {
            onSuccess: () => {
                toast.success("Member removed successfully")
                onClose()
            },
            onError: () => {
                toast.error("Failed to remove member ❌")
            }
        })
    }
    const onLeave = async () => {
        const ok = await confirmLeave();
        if (!ok) return;

        removeMember({ memberId }, {
            onSuccess: () => {
                router.replace("/")
                toast.success("You left the workspace successfully")
                onClose()
            },
            onError: () => {
                toast.error("Failed to left the workspace ❌")
            }
        })
    }

    const onUpdate = async (role: "admin" | "member") => {
        const ok = await confirmUpdate();
        if (!ok) return;

        updateMember({ memberId, role }, {
            onSuccess: () => {
                toast.success("Role change successfully")
                onClose()
            },
            onError: () => {
                toast.error("Failed to change role❌")
            }
        })
    }

    if (isMemberLoading || isCurrentMemberLoading) {
        return (
            <div className='h-full flex flex-col'>
                <div className="flex justify-between items-center px-4 h-[49px] border-b">
                    <p className='text-lg font-bold'>Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className='size-5 stroke-[1.5]' />
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    const avatarFallback = member?.user.name?.[0] ?? "M"

    if (!member) {
        return (
            <div className='h-full flex flex-col'>
                <div className="flex justify-between items-center px-4 h-[49px] border-b">
                    <p className='text-lg font-bold'>Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className='size-5 stroke-[1.5]' />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5  text-muted-foreground" />
                    <p className='text-sm text-muted-foreground'>Profile not found!</p>
                </div>
            </div>
        )
    }
    return (
        <>
            <LeaveDialog />
            <RemoveDialog />
            <UpdateDialog />
            <div className='h-full flex flex-col'>
                <div className="flex justify-between items-center px-4 h-[49px] border-b">
                    <p className='text-lg font-bold'>Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className='size-5 stroke-[1.5]' />
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                    <Avatar className='max-w-[256px] max-h-[256px] size-full'>
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className='aspect-square text-6xl'>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col p-4">
                    <p className='text-xl font-bold' >{member.user.name}</p>
                    {currentMember?.role === "admin" &&
                        currentMember?._id !== memberId ? (
                        <div className='flex items-center gap-2 mt-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger className='w-full' asChild>
                                    <Button variant="outline" className=' capitalize'>
                                        {member.role} <ChevronDownIcon className='size-4 ml-2' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-full'>
                                    <DropdownMenuRadioGroup
                                        value={member.role}
                                        onValueChange={(role) => onUpdate(role as "admin" | "member")}
                                    >
                                        <DropdownMenuRadioItem value='admin'>
                                            Admin
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value='member'>
                                            Member
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button onClick={onRemove} variant="outline" className='w-full capitalize'>
                                Remove
                            </Button>
                        </div>
                    ) : currentMember?._id === memberId &&
                        currentMember?.role !== "admin" ? (
                        <div className="mt-4">
                            <Button onClick={onLeave} variant="outline" className='w-full capitalize'>
                                Leave
                            </Button>
                        </div>
                    ) : null
                    }
                </div>
                <Separator />
                <div className="flex flex-col p-4">
                    <p className='text-sm font-bold mb-4'>Contact information</p>
                    <div className="flex items-center gap-2">
                        <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
                            <MailIcon className="size-4" />
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-[13px] font-semibold text-muted-foreground'>
                                Email Address
                            </p>
                            <Link href={`mailto:${member.user.email}`} className='text-sm hover:underline text-[#1264a3]'>
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
