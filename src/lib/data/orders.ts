import type { OrderStatus, Prisma } from "@/generated/prisma/client";
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
    where: { status: { not: "DELIVERED" } },
    orderBy: { eventDate: { sort: "asc", nulls: "last" } },
    take: limit,
    include: { items: { include: { product: true } } },
  });
}

export async function getAllOrdersGroupedByStatus() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { status: { not: "DELIVERED" } }, 
        { status: "DELIVERED", updatedAt: { gte: sevenDaysAgo } }, 
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return orders;
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrderHistory(searchParams?: {
  q?: string;
  status?: string;
}) {
  const where: Prisma.OrderWhereInput = {};

  if (searchParams?.q) {
    where.customerName = { contains: searchParams.q, mode: "insensitive" };
  }

  if (searchParams?.status && searchParams.status !== "ALL") {
    where.status = searchParams.status as OrderStatus;
  }

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}