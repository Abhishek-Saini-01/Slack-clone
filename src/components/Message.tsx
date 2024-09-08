import { useRemoveMessage } from "@/features/messages/api/useRemoveMessage";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import { useToggleReaction } from "@/features/reactions/api/useToggleReaction";
import { useConfirm } from "@/hooks/useConfirm";
import { usePanel } from "@/hooks/usePanel";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Doc, Id } from "../../convex/_generated/dataModel";
import Hint from "./Hint";
import MessageToolbar from "./MessageToolbar";
import Reactions from "./Reactions";
import ThreadBar from "./ThreadBar";
import Thumbnail from "./Thumbnail";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Renderer = dynamic(() => import("@/components/Renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

interface MessageProps {
    id: Id<"messages">
    memberId: Id<"members">
    authorImage?: string
    authorName?: string
    isAuthor: boolean
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>
    body: Doc<"messages">["body"]
    image: string | null | undefined
    updatedAt: Doc<"messages">['updatedAt']
    createdAt: Doc<"messages">['_creationTime']
    isEditing: boolean
    setIsEditingId: (id: Id<"messages"> | null) => void;
    isCompact?: boolean
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    threadTimestamp?: number
    threadName?: string
}
const Message = ({
    body,
    createdAt,
    id,
    image,
    isAuthor,
    isCompact,
    isEditing,
    memberId,
    reactions,
    setIsEditingId,
    updatedAt,
    authorImage,
    authorName = "Member",
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName
}: MessageProps) => {
    const { onOpenMessage, parentMessageId, onClose } = usePanel();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Message", "Are you sure you want to delete this message? This cannot be undone."
    )
    const avatarFallback = authorName.charAt(0).toLocaleUpperCase();
    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();

    const isPending = isUpdatingMessage || isRemovingMessage;

    const handleReaction = (value: string) => {
        toggleReaction({ messageId: id, value }, {
            onError: () => {
                toast.error("Failed to toggle reaction");
            }
        })
    }

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ body, messageId: id }, {
            onSuccess: () => {
                toast.success("Message Updated");
                setIsEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            }
        });
    }

    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeMessage({ messageId: id }, {
            onSuccess: () => {
                toast.success("Message Deleted");

                if (parentMessageId === id) {
                    onClose();
                }
            },
            onError: () => {
                toast.error("Failed to delete message")
            }
        })
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </Hint>
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setIsEditingId(null)}
                                    variant="update"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                ) : null}
                                <Reactions
                                    data={reactions}
                                    onChange={handleReaction}
                                />
                                <ThreadBar
                                    name={threadName}
                                    count={threadCount}
                                    image={threadImage}
                                    timestamp={threadTimestamp}
                                    onClick={() => onOpenMessage(id)}
                                />
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <MessageToolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setIsEditingId(id)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleRemove}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            <ConfirmDialog />
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage} />
                            <AvatarFallback className="font-bold">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setIsEditingId(null)}
                                variant="update"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button onClick={() => { }} className="font-bold text-primary hover:underline">
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body} />
                            <Thumbnail url={image} />
                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">(edited)</span>
                            ) : null}
                            <Reactions
                                data={reactions}
                                onChange={handleReaction}
                            />
                            <ThreadBar
                                name={threadName}
                                count={threadCount}
                                image={threadImage}
                                timestamp={threadTimestamp}
                                onClick={() => onOpenMessage(id)}
                            />
                        </div>
                    )}
                </div>
                {!isEditing && (
                    <MessageToolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setIsEditingId(id)}
                        handleThread={() => onOpenMessage(id)}
                        handleDelete={handleRemove}
                        handleReaction={handleReaction}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    )
}

export default Message