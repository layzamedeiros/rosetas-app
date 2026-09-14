"use client";

import type { Prisma } from "@/generated/prisma/client";
import { orderTotal } from "@/lib/format-order-summary";
import { orderStatusLabels, priorityLabels } from "@/lib/labels";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

type OrderDetailsDialogProps = {
  order: OrderWithItems;
  onClose: () => void;
  onEdit: () => void;
};

export function OrderDetailsDialog({
  order,
  onClose,
  onEdit,
}: OrderDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const total = orderTotal(order.items);
  const formatCurrency = (value: number) =>
    (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100vw-2rem)] max-w-lg rounded-2xl border-none bg-background p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
    >
      <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
        <header className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl">{order.customerName}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Criado em {order.createdAt.toLocaleDateString("pt-BR")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <section className="border-b border-border pb-5">
            <p className="eyebrow mb-2">CLIENTE</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {order.customerWhatsapp}
              </p>
              <a
                href={`https://wa.me/${order.customerWhatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </section>

          <section className="border-b border-border py-5">
            <p className="eyebrow mb-3">EVENTO</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Data do evento</p>
                <p className="text-sm">
                  {order.eventDate
                    ? order.eventDate.toLocaleDateString("pt-BR")
                    : "Não informada"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Prioridade</p>
                <p className="text-sm">{priorityLabels[order.priority]}</p>
              </div>
            </div>
          </section>

          <section className="border-b border-border py-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">ITENS</p>
              <span className="text-xs text-muted-foreground">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "itens"}
              </span>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border">
              {order.items.map((item) => {
                const itemTotal = item.quantity * item.unitPrice;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {item.product?.title ?? "Produto removido"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {formatCurrency(itemTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total do pedido</span>
              <span className="font-display text-xl">{formatCurrency(total)}</span>
            </div>
          </section>

          <section className="border-b border-border py-5">
            <p className="eyebrow mb-2">STATUS</p>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
              {orderStatusLabels[order.status]}
            </span>
          </section>

          {order.notes && (
            <section className="pt-5">
              <p className="eyebrow mb-2">OBSERVAÇÕES</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end border-t border-border bg-background px-5 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Editar pedido
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}