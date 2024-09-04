
import EmojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { ReactNode, useState } from "react";

interface EmojiPopoverProps {
    children: ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: any) => void;
}
const EmojiPopover = ({
    children,
    hint = "Emoji",
    onEmojiSelect
}: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const onSelectEmoji = (emoji:any) => {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 0);
    } 
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white border border-white/5">
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 w-full bg-transparent  border-none shadow-none">
                    <Picker data={EmojiData} onEmojiSelect={onSelectEmoji} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}

export default EmojiPopover