export function KanbanSkeleton() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
      {Array.from({ length: 5 }).map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex h-full min-h-[60vh] w-70 shrink-0 flex-col rounded-xl border border-border bg-ring/10 px-4 py-3 animate-pulse"
        >
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <div className="h-3 w-24 rounded bg-ring/10" />
            <div className="h-6 w-6 rounded-full bg-ring/10" />
          </div>

          <div className="flex-1 space-y-3 overflow-hidden pb-2">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="h-28 w-full rounded-xl border border-border bg-ring/10 p-3"
              >
                <div className="h-5 w-3/5 rounded bg-ring/10" />
                <div className="mt-3 h-3 w-4/5 rounded bg-ring/10" />
                <div className="mt-2 h-3 w-2/5 rounded bg-ring/10" />
                <div className="mt-4 h-2 w-1/3 rounded bg-ring/10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}