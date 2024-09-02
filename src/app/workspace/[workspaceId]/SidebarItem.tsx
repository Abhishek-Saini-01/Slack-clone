import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { IconType } from "react-icons/lib"

const SidebarItemVarients = cva(
    "flex items-center gap-1.5 justify-start font-noraml h-7 px-[18px] text-sm overflow-hidden",
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

interface SidebarItemProps {
    label: string
    icon: LucideIcon | IconType
    id: string
    varient?: VariantProps<typeof SidebarItemVarients>["varient"];
}
const SidebarItem = ({
    label,
    icon:Icon,
    id,
    varient
}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();

    return (
        <Button 
            variant="transparent" 
            asChild
            size="sm"
            className={cn(SidebarItemVarients({varient}))}
        >
            <Link
                href={`/worksapce/${workspaceId}/channel/${id}`}
            >
                <Icon className="size-3.5 mr-1 shrink-0" />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}

export default SidebarItem