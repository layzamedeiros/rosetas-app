import { orderStatusOrder } from "@/lib/labels";
import prisma from "@/lib/prisma";

export async function getOrderCountsByStatus() {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const countByStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count.status])
  );

  return orderStatusOrder.map((status) => ({
    status,
    count: countByStatus[status] ?? 0,
  }));
}

export async function getUpcomingDeliveries(limit = 5) {
  return prisma.order.findMany({
    orderBy: { eventDate: { sort: "asc", nulls: "last" } },
    take: limit,
    include: { items: { include: { product: true } } },
  });
}