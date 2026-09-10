"use client";

import type { Order, OrderItem, Product } from "@/generated/prisma/client";
import { formatOrderSummary } from "@/lib/format-order-summary";
import { priorityLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product | null })[];
};

type OrderCardProps = {
  order: OrderWithItems;
  onClick: () => void;
};

export function OrderCard({ order, onClick }: OrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: order.id,
    data: { status: order.status },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "w-full cursor-pointer touch-none rounded-xl border border-border bg-card p-3 text-left transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isDragging && "opacity-30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate font-display text-lg leading-tight text-deep">
          {order.customerName}
        </p>

        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          onClick={(event) => event.stopPropagation()}
          className="shrink-0 cursor-grab touch-none text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
          title="Arrastar pedido"
          aria-label="Arrastar pedido"
        >
          <GripVertical size={15} />
        </button>
      </div>

      <p className="mb-1 text-xs text-muted-foreground">
        {formatOrderSummary(order.items)}
      </p>

      {total > 0 && (
        <p className="mb-2 text-xs">
          {(total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {order.eventDate && (
          <p className="text-xs text-muted-foreground">
            Evento: {order.eventDate.toLocaleDateString("pt-BR")}
          </p>
        )}

        <span className="flex items-center gap-1.5 text-[10px]">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              {
                LOW: "bg-muted-foreground",
                NORMAL: "bg-primary",
                HIGH: "bg-destructive",
              }[order.priority]
            )}
          />
          {priorityLabels[order.priority].toUpperCase()}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground/70">
        Criado em {order.createdAt.toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}

export function OrderCardOverlay({
  order,
}: {
  order: OrderWithItems;
}) {
  const total = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="w-70 rounded-xl border border-border bg-card p-3 text-left shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate font-display text-lg leading-tight text-deep">
          {order.customerName}
        </p>

        <GripVertical
          size={15}
          className="shrink-0 text-muted-foreground/60"
        />
      </div>

      <p className="mb-1 text-xs text-muted-foreground">
        {formatOrderSummary(order.items)}
      </p>

      {total > 0 && (
        <p className="mb-2 text-xs">
          {(total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {order.eventDate && (
          <p className="text-xs text-muted-foreground">
            Evento: {order.eventDate.toLocaleDateString("pt-BR")}
          </p>
        )}

        <span className="flex items-center gap-1.5 text-[10px]">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              {
                LOW: "bg-muted-foreground",
                NORMAL: "bg-primary",
                HIGH: "bg-destructive",
              }[order.priority]
            )}
          />
          {priorityLabels[order.priority].toUpperCase()}
        </span>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground/70">
        Criado em {order.createdAt.toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}