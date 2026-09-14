import { DashboardStats } from "@/components/admin/dashboard-stats";
import { UpcomingDeliveries } from "@/components/admin/upcoming-deliveries";
import { getOrderCountsByStatus, getUpcomingDeliveries } from "@/lib/data/orders";

export default async function DashboardPage() {
  const [stats, orders] = await Promise.all([
    getOrderCountsByStatus(),
    getUpcomingDeliveries(),
  ]);

  return (
    <div className="p-8">
      <p className="eyebrow mb-2">Visão geral</p>
      <h1 className="font-display text-3xl mb-8">
        Olá! Como estão os pedidos hoje?
      </h1>

      <DashboardStats stats={stats} />
      <UpcomingDeliveries orders={orders} />
    </div>
  );
}