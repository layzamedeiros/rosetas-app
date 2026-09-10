"use client";

import { updateOrderStatus } from "@/app/admin/pedidos/actions";
import type { Order, Prisma, Product } from "@/generated/prisma/client";
import { orderStatusLabels, orderStatusOrder } from "@/lib/labels";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { EditOrderDialog } from "./edit-order-dialog";
import { OrderCard, OrderCardOverlay } from "./order-card";
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

function Column({
  status,
  orders,
  onOrderClick,
}: {
  status: Order["status"];
  orders: OrderWithItems[];
  onOrderClick: (order: OrderWithItems) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[60vh] w-70 shrink-0 flex-col rounded-xl border border-border bg-ring/10 px-4 py-3 transition-colors ${isOver ? "bg-secondary/50" : ""
        }`}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <p className="truncate text-xs uppercase leading-tight text-deep font-display">
          {orderStatusLabels[status]}
        </p>

        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs">
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-2 scrollbar-hide">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onOrderClick(order)}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  orders,
  products,
}: {
  orders: OrderWithItems[];
  products: Product[];
}) {
  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithItems | null>(null);

  const [editingOrder, setEditingOrder] =
    useState<OrderWithItems | null>(null);

  const [activeOrder, setActiveOrder] =
    useState<OrderWithItems | null>(null);

  const [optimisticOrders, setOptimisticOrders] = useOptimistic(
    orders,
    (
      state,
      { orderId, status }: { orderId: string; status: Order["status"] }
    ) =>
      state.map((order) =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function handleDragStart(event: {
    active: {
      id: string | number;
    };
  }) {
    const order = orders.find(
      (item) => item.id === event.active.id
    );

    if (order) {
      setActiveOrder(order);
    }
  }

  function handleDragCancel() {
    setActiveOrder(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id as string;

    const newStatus = over.data.current?.status as
      | Order["status"]
      | undefined;

    if (!newStatus) return;

    const order = orders.find((item) => item.id === orderId);

    if (!order || order.status === newStatus) return;

    startTransition(() => {
      setOptimisticOrders({
        orderId,
        status: newStatus,
      });
    });

    try {
      const response = await updateOrderStatus(
        orderId,
        newStatus
      );

      if (!response.success) {
        toast.error(
          response.error || "Não foi possível atualizar o status."
        );
      }
    } catch {
      toast.error("Erro de conexão ao atualizar status.");
    }
  }

  return (
    <>
      <DndContext
        id="kanban-board"
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide">
          {orderStatusOrder.map((status) => (
            <Column
              key={status}
              status={status}
              orders={optimisticOrders.filter(
                (order) => order.status === status
              )}
              onOrderClick={setSelectedOrder}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOrder ? (
            <OrderCardOverlay order={activeOrder} />
          ) : null}
        </DragOverlay>
      </DndContext>

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