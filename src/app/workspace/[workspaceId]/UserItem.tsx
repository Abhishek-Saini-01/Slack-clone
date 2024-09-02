
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

const UserItemVarients = cva(
    "flex items-center gap-1.5 justify-start font-noraml h-7 px-4 text-sm overflow-hidden",
    {
        variants: {
            varient: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",
            }
        },
        defaultVariants: {
            varient: "default"
        }
    }
)
interface UserItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    varient?: VariantProps<typeof UserItemVarients>["varient"];
}

const UserItem = ({
    id,
    image,
    label="Members",
    varient
}: UserItemProps) => {
    const workspaceId = useWorkspaceId();
    const avatarFallback = label.charAt(0).toLocaleUpperCase();
    
    return (
        <Button
            variant="transparent"
            className={cn(UserItemVarients({varient}))}
            size="sm"
            asChild
        >
            <Link href={`/worksapce/${workspaceId}/member/${id}`}>
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage src={image} className="rounded-md"/>
                    <AvatarFallback className="rounded-md bg-sky-400 text-white font-bold text-xs">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}

export default UserItem