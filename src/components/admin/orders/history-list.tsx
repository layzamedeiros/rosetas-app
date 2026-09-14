"use client";

import type { Prisma, Product } from "@/generated/prisma/client";
import { formatOrderSummary, orderTotal } from "@/lib/format-order-summary";
import { orderStatusLabels } from "@/lib/labels";
import { useState } from "react";
import { EditOrderDialog } from "./edit-order-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export function HistoryList({
  orders,
  products,
}: {
  orders: OrderWithItems[];
  products: Product[];
}) {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderWithItems | null>(null);

  if (orders.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">Nenhum pedido encontrado no histórico.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-5 py-3 font-medium text-muted-foreground">Cliente</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Itens</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Total</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Data do Pedido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const total = orderTotal(order.items);

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer transition-colors hover:bg-secondary/20"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerWhatsapp}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {formatOrderSummary(order.items)}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {(total / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground">
                        {orderStatusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {order.createdAt.toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onEdit={() => {
            setEditingOrder(selectedOrder);
            setSelectedOrder(null);
          }}
        />
      )}

      {editingOrder && (
        <EditOrderDialog
          key={editingOrder.id}
          order={editingOrder}
          products={products}
          onClose={() => setEditingOrder(null)}
          onDeleted={() => {
            setEditingOrder(null);
            setSelectedOrder(null);
          }}
        />
      )}
    </>
  );
}