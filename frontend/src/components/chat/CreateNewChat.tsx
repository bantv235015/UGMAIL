import { useFriendStore } from "@/stores/useFriendStore";
import { Card } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { MessageCircle } from "lucide-react";
import FriendListModal from "../createNewChat/FriendListModal";

const CreateNewChat = () => {
  const { getFriends } = useFriendStore();

  const handleGetFriends = async () => {
    await getFriends();
  };

  return (
    <div className="flex gap-2">
      <Card
        className="group/card flex-1 cursor-pointer p-3 transition-smooth glass hover:border-primary/25 hover:shadow-[var(--shadow-soft)]"
        onClick={handleGetFriends}
      >
        <Dialog>
          <DialogTrigger>
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-chat shadow-sm transition-bounce group-hover/card:scale-105">
                <MessageCircle className="size-4 text-white" />
              </div>
              <span className="text-sm font-semibold capitalize text-foreground">
                gửi tin nhắn mới
              </span>
            </div>
          </DialogTrigger>

          <FriendListModal />
        </Dialog>
      </Card>
    </div>
  );
};

export default CreateNewChat;
