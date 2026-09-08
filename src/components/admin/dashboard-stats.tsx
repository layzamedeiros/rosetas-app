import { orderStatusLabels } from "@/lib/labels";

type StatCount = { status: string; count: number };

export function DashboardStats({ stats }: { stats: StatCount[] }) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-10">
      {stats.map(({ status, count }) => (
        <div key={status} className="bg-ring/10 rounded-2xl p-5">
          <p className="eyebrow mb-3">{orderStatusLabels[status]}</p>
          <p className="font-display text-4xl">{count}</p>
        </div>
      ))}
    </div>
  );
}