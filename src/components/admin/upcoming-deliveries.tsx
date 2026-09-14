import { Prisma } from "@/generated/prisma/client";
import { formatOrderSummary } from "@/lib/format-order-summary";
import Link from "next/link";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export function UpcomingDeliveries({ orders }: { orders: OrderWithItems[] }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans text-base font-medium">Próximas entregas</h2>
        <Link href="/admin/pedidos" className="text-primary text-sm">
          Ver kanban →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum pedido cadastrado.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {orders.map((order) => (
            <li key={order.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatOrderSummary(order.items)}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {order.eventDate
                  ? order.eventDate.toLocaleDateString("pt-BR")
                  : "Sem data"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}