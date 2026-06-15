import { SidebarInset } from "../ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex h-full w-full animate-pulse rounded-lg bg-card">
      <div className="flex flex-1 items-center justify-center bg-secondary/50 dark:bg-background">
        <div className="space-y-4 text-center">
          <div className="mx-auto mb-6 size-24 rounded-full bg-muted shadow-inner" />
          <div className="mx-auto h-10 w-80 max-w-[70vw] rounded bg-muted" />
          <div className="mx-auto h-8 w-64 max-w-[60vw] rounded bg-muted" />
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
