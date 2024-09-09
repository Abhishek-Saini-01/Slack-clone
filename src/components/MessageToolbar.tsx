import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react"
import EmojiPopover from "./EmojiPopover"
import Hint from "./Hint"
import { Button } from "./ui/button"

interface MessageToolbarProps {
    isAuthor: boolean
    isPending: boolean
    handleEdit: () => void
    handleThread: () => void
    handleDelete: () => void
    handleReaction: (value: string) => void
    hideThreadButton?: boolean
}
const MessageToolbar = ({
    handleDelete,
    handleEdit,
    handleReaction,
    handleThread,
    isAuthor,
    isPending,
    hideThreadButton
}: MessageToolbarProps) => {
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiPopover
                    hint="Add reaction"
                    onEmojiSelect={(emoji) => handleReaction(emoji)}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                    >
                        <Smile className="size-4" />
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (
                    <Hint label="Reply in thread">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageSquareTextIcon className="size-4" />
                        </Button>
                    </Hint>
                )}

                {isAuthor && (
                    <Hint label="Edit messsage">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={handleEdit}
                        >
                            <Pencil className="size-4" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <Hint label="Delete messsage">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={handleDelete}
                        >
                            <Trash className="size-4" />
                        </Button>
                    </Hint>
                )}
            </div>
        </div>
    )
}

export default MessageToolbar