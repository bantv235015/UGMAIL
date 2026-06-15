import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatOnlineTime } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ChatCardProps {
  convoId: string;
  name: string;
  timestamp?: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  unreadCount?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
}

const ChatCard = ({
  convoId,
  name,
  timestamp,
  isActive,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
}: ChatCardProps) => {
  const { deleteConversation } = useChatStore();

  const handleDelete = async () => {
    try {
      await deleteConversation(convoId);
      toast.success("Da xoa doan chat");
    } catch (error) {
      console.error(error);
      toast.error("Khong the xoa doan chat. Hay thu lai!");
    }
  };

  return (
    <Card
      key={convoId}
      className={cn(
        "group border border-transparent p-3 cursor-pointer transition-smooth bg-transparent shadow-none hover:border-primary/20 hover:bg-sidebar-accent/70 hover:shadow-sm",
        isActive &&
          "border-primary/25 bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-primary/20"
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3
              className={cn(
                "truncate text-sm font-semibold",
                unreadCount && unreadCount > 0 && "text-foreground"
              )}
            >
              {name}
            </h3>

            <span className="shrink-0 text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1">{subtitle}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Mo tuy chon doan chat"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-smooth hover:bg-accent hover:text-accent-foreground group-hover:opacity-100 data-[state=open]:opacity-100"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
                  <Trash2 className="size-4" />
                  Xoa doan chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
