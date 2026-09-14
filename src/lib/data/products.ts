import type { Prisma, ProductCategory } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
  });
}

export async function getAllProducts(searchParams?: {
  q?: string;
  category?: string;
  status?: string;
}) {
  const where: Prisma.ProductWhereInput = {};

  if (searchParams?.q) {
    where.title = { contains: searchParams.q, mode: "insensitive" };
  }

  if (searchParams?.category && searchParams.category !== "ALL") {
    where.category = searchParams.category as ProductCategory;
  }

  if (searchParams?.status === "ACTIVE") where.active = true;
  if (searchParams?.status === "INACTIVE") where.active = false;

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orderItems: true },
      },
    },
  });
}