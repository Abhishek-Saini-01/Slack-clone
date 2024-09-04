import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import Hint from "./Hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Renderer = dynamic(() => import("@/components/Renderer"), { ssr: false });

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
    isCompact: boolean
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    threadTimestamp?: number
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
    threadTimestamp
}: MessageProps) => {
    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>
                    <div className="flex flex-col w-full">
                        <Renderer value={body} />
                        {updatedAt ? (
                            <span className="text-xs text-muted-foreground">(edited)</span>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    }

    const avatarFallback = authorName.charAt(0).toLocaleUpperCase();
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <button>
                    <Avatar className="rounded-md">
                        <AvatarImage src={authorImage} className="rounded-md" />
                        <AvatarFallback className="rounded-md bg-sky-400 text-white font-bold text-xs">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>
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
                    {updatedAt ? (
                        <span className="text-xs text-muted-foreground">(edited)</span>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Message