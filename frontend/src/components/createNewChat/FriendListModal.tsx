import { useFriendStore } from "@/stores/useFriendStore";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MessageCircleMore, Users } from "lucide-react";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/useChatStore";

const FriendListModal = () => {
  const { friends } = useFriendStore();
  const { createConversation } = useChatStore();

  const handleAddConversation = async (friendId: string) => {
    await createConversation("direct", "", [friendId]);
  };

  return (
    <DialogContent className="max-w-md border-border/80 bg-card">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize tracking-tight">
          <MessageCircleMore className="size-5 text-primary" />
          bắt đầu hội thoại mới
        </DialogTitle>
      </DialogHeader>

      {/* friends list */}
      <div className="space-y-4">
        <h1 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          danh sách bạn bè
        </h1>

        <div className="beautiful-scrollbar max-h-60 space-y-2 overflow-y-auto pr-1">
          {friends.map((friend) => (
            <Card
              onClick={() => handleAddConversation(friend._id)}
              key={friend._id}
              className="group/friendCard cursor-pointer p-3 transition-smooth glass-light hover:border-primary/25 hover:bg-accent/60 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3">
                {/* avatar */}
                <div className="relative">
                  <UserAvatar
                    type="sidebar"
                    name={friend.displayName}
                    avatarUrl={friend.avatarUrl}
                  />
                </div>

                {/* info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <h2 className="truncate text-sm font-semibold">
                    {friend.displayName}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    @{friend.username}
                  </span>
                </div>
              </div>
            </Card>
          ))}

          {friends.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Users className="mx-auto mb-3 size-12 opacity-50" />
              Chưa có bạn bè. Thêm bạn vô để tám!
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default FriendListModal;
