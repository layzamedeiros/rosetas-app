import type { Prisma } from "@/generated/prisma/client";
import { ProductCard } from "./product-card";

type ProductWithCount = Prisma.ProductGetPayload<{
  include: { _count: { select: { orderItems: true } } };
}>;

export function ProductGrid({ products }: { products: ProductWithCount[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center mt-6">
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}