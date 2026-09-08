import type { OrderItem, Product } from "@/generated/prisma/client";

type ItemWithProduct = OrderItem & { product: Product | null };

export function formatOrderSummary(items: ItemWithProduct[]) {
  if (items.length === 0) return "Sem itens";

  const [first, ...rest] = items;
  const label = first.product?.title ?? "Produto personalizado";
  const summary = `${label} · ${first.quantity} un.`;

  if (rest.length === 0) return summary;

  return `${summary} + ${rest.length} item(ns)`;
}