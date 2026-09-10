import { KanbanBoard } from "@/components/admin/orders/kanban-board";
import { NewOrderDialog } from "@/components/admin/orders/new-order-dialog";
import { Product } from "@/generated/prisma/browser";
import { getAllOrdersGroupedByStatus } from "@/lib/data/orders";
import { getActiveProducts } from "@/lib/data/products";
import { Suspense } from "react";

export default async function OrdersPage() {
  const products = await getActiveProducts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="eyebrow mb-2">GESTÃO</p>
          <h1 className="font-display text-3xl">Pedidos</h1>
        </div>
        <NewOrderDialog products={products} />
      </div>

      <Suspense fallback={<KanbanSkeleton />}>
        <OrdersDataWrapper products={products} />
      </Suspense>
    </div>
  );
}

async function OrdersDataWrapper({ products }: { products: Product[] }) {
  const orders = await getAllOrdersGroupedByStatus();

  return (
    <>
      <p className="text-muted-foreground text-sm mb-8">
        {orders.length}{" "}
        {orders.length === 1 ? "pedido cadastrado." : "pedidos cadastrados."}
      </p>
      <KanbanBoard orders={orders} products={products} />
    </>
  );
}

function KanbanSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-5 gap-4">
      {[...Array(5)].map((_, colIndex) => (
        <div key={colIndex} className="min-h-50 w-full rounded-2xl bg-ring/5 p-4 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-24 bg-ring/10 rounded"></div>
            <div className="h-6 w-6 rounded-full bg-ring/10"></div>
          </div>

          <div className="space-y-3">
            {[...Array(3)].map((_, cardIndex) => (
              <div key={cardIndex} className="h-28 w-full bg-ring/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}