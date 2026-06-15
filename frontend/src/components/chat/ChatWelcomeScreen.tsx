import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full overflow-hidden rounded-lg bg-card">
      <ChatWindowHeader />
      <div className="flex flex-1 items-center justify-center bg-secondary/50 px-6 dark:bg-background">
        <div className="max-w-md text-center">
          <div className="pulse-ring mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-chat shadow-glow">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
            Chào mừng bạn đến với Ugmail!
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Chọn một cuộc hội thoại để bắt đầu chat!
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
