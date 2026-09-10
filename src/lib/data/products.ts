import prisma from "@/lib/prisma";

export async function getActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
  });
}