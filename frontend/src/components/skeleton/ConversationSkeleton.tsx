import { Card } from "../ui/card";

const ConversationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="animate-pulse border border-border/70 bg-transparent p-3 shadow-none"
        >
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="size-10 rounded-full bg-muted" />

            {/* Info skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ConversationSkeleton;
