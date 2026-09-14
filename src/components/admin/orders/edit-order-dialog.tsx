"use client";

import { deleteOrder, updateOrder } from "@/app/admin/pedidos/actions";
import type { Prisma, Product } from "@/generated/prisma/client";
import { orderStatusLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { OrderFormValues, orderSchema } from "@/lib/validations/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { OrderItemCard } from "./order-item-card";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

type EditOrderDialogProps = {
  order: OrderWithItems;
  products: Product[];
  onClose: () => void;
  onDeleted: () => void;
};

export function EditOrderDialog({
  order,
  products,
  onClose,
  onDeleted,
}: EditOrderDialogProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const mainDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: order.customerName,
      customerWhatsapp: order.customerWhatsapp,
      eventDate: order.eventDate ? new Date(order.eventDate).toISOString().split("T")[0] : "",
      priority: order.priority,
      status: order.status,
      notes: order.notes ?? "",
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const total = watchedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  useEffect(() => {
    mainDialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (showDeleteConfirm) {
      deleteDialogRef.current?.showModal();
    } else {
      deleteDialogRef.current?.close();
    }
  }, [showDeleteConfirm]);

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const response = await updateOrder(order.id, data);
      if (!response.success) {
        setServerError(response.error || "Não foi possível atualizar o pedido.");
        toast.error(response.error || "Erro ao atualizar pedido.");
      } else {
        toast.success("Pedido atualizado com sucesso!");
        onClose();
      }
    });
  });

  function handleDelete() {
    setServerError(null);
    startTransition(async () => {
      const response = await deleteOrder(order.id);
      if (!response.success) {
        setServerError(response.error || "Não foi possível excluir o pedido.");
        toast.error(response.error || "Erro ao excluir pedido.");
        setShowDeleteConfirm(false);
      } else {
        toast.success("Pedido excluído permanentemente!");
        onDeleted();
      }
    });
  }

  return (
    <>
      <dialog
        ref={mainDialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!isPending) onClose();
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl border-none bg-background p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
      >
        <form
          onSubmit={onSubmit}
          className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden"
        >
          <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 id="edit-order-title" className="font-display text-2xl">Editar pedido</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Atualize os dados do cliente e os itens do pedido.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="Fechar"
              className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {serverError && !showDeleteConfirm && (
              <div role="alert" className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            {Object.keys(form.formState.errors).length > 0 && !serverError && (
              <div role="alert" className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                Verifique os campos em vermelho antes de prosseguir.
              </div>
            )}

            <section className="mb-7">
              <div className="mb-4">
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-xs text-muted-foreground">Informações de contato</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-customer-name" className="eyebrow mb-1.5 block">Nome do cliente</label>
                  <input
                    id="edit-customer-name"
                    {...form.register("customerName")}
                    placeholder="Ex.: Maria Silva"
                    className={cn(
                      "w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary",
                      form.formState.errors.customerName ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="edit-customer-whatsapp" className="eyebrow mb-1.5 block">WhatsApp</label>
                  <input
                    id="edit-customer-whatsapp"
                    type="tel"
                    {...form.register("customerWhatsapp")}
                    placeholder="(84) 99999-9999"
                    className={cn(
                      "w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary",
                      form.formState.errors.customerWhatsapp ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
              </div>
            </section>

            <section className="mb-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Itens do pedido</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Adicione ou altere os produtos solicitados pelo cliente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                  disabled={isPending}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Adicionar item</span>
                  <span className="sm:hidden">Adicionar</span>
                </button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <OrderItemCard
                    key={field.id}
                    index={index}
                    products={products}
                    itemsLength={fields.length}
                    removeItem={remove}
                    form={form}
                  />
                ))}
              </div>
            </section>

            <div className="mb-7 flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3.5">
              <div>
                <p className="text-sm font-medium">Total do pedido</p>
                <p className="text-xs text-muted-foreground">
                  {fields.length === 1 ? "1 item" : `${fields.length} itens`}
                </p>
              </div>
              <span className="font-display text-xl text-primary">
                {(total / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>

            <section className="mb-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="edit-event-date" className="eyebrow mb-1.5 block">Data do evento</label>
                  <input
                    id="edit-event-date"
                    type="date"
                    {...form.register("eventDate")}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="edit-priority" className="eyebrow mb-1.5 block">Prioridade</label>
                  <div className="relative">
                    <select
                      id="edit-priority"
                      {...form.register("priority")}
                      className="w-full appearance-none rounded-lg border border-border bg-card px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary"
                    >
                      <option value="LOW">Baixa</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">Alta</option>
                    </select>
                    <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground" />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-status" className="eyebrow mb-1.5 block">Status</label>
                  <div className="relative">
                    <select
                      id="edit-status"
                      {...form.register("status")}
                      className="w-full appearance-none rounded-lg border border-border bg-card px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary"
                    >
                      {Object.entries(orderStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4">
                <p className="text-sm font-medium">Detalhes do pedido</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Cores, nomes, medidas ou outras informações importantes.</p>
              </div>
              <textarea
                {...form.register("notes")}
                rows={3}
                placeholder="Ex.: usar tons de rosa e branco, nome dos noivos..."
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              />
            </section>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-destructive transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={15} />
              Excluir pedido
            </button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed",
                  isPending && "opacity-60"
                )}
              >
                {isPending ? "Salvando alterações..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </form>
      </dialog>

      <dialog
        ref={deleteDialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!isPending) setShowDeleteConfirm(false);
        }}
        className="m-auto w-full max-w-sm rounded-2xl border-none bg-background p-5 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <h3 className="font-display text-xl">Excluir pedido?</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Essa ação não pode ser desfeita. O pedido de{" "}
          <span className="font-medium text-foreground">{order.customerName}</span> será excluído permanentemente.
        </p>

        {serverError && showDeleteConfirm && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isPending}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Excluindo..." : "Excluir pedido"}
          </button>
        </div>
      </dialog>
    </>
  );
}