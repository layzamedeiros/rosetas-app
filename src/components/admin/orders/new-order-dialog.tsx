"use client";

import { createOrder } from "@/app/admin/pedidos/actions";
import type { Product } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { OrderFormValues, orderSchema } from "@/lib/validations/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { OrderItemCard } from "./order-item-card";

export function NewOrderDialog({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerWhatsapp: "",
      eventDate: "",
      priority: "NORMAL",
      notes: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
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
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    if (isPending) return;
    setOpen(false);
    setServerError(null);
    form.reset();
  }

  const onSubmit = form.handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const response = await createOrder(data);
      if (!response.success) {
        setServerError(response.error || "Ocorreu um erro ao criar o pedido.");
        toast.error(response.error || "Erro ao criar pedido.");
      } else {
        toast.success("Pedido criado com sucesso!");
        closeDialog();
      }
    });
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus size={16} />
        Novo pedido
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closeDialog();
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl border-none bg-background p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
      >
        <form
          onSubmit={onSubmit}
          className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden"
        >
          <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 id="new-order-title" className="font-display text-2xl">Novo pedido</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cadastre os dados do cliente e os itens do pedido.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              disabled={isPending}
              aria-label="Fechar"
              className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {serverError && (
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
                  <label htmlFor="customerName" className="eyebrow mb-1.5 block">Nome do cliente</label>
                  <input
                    id="customerName"
                    {...form.register("customerName")}
                    placeholder="Ex.: Maria Silva"
                    className={cn(
                      "w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary",
                      form.formState.errors.customerName ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="customerWhatsapp" className="eyebrow mb-1.5 block">WhatsApp</label>
                  <input
                    id="customerWhatsapp"
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
                  <p className="mt-0.5 text-xs text-muted-foreground">Adicione os produtos solicitados pelo cliente.</p>
                </div>
                <button
                  type="button"
                  onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="eventDate" className="eyebrow mb-1.5 block">Data do evento</label>
                  <input
                    id="eventDate"
                    type="date"
                    {...form.register("eventDate")}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="eyebrow mb-1.5 block">Prioridade</label>
                  <div className="relative">
                    <select
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

          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-background px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
            <button
              type="button"
              onClick={closeDialog}
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
              {isPending ? "Criando pedido..." : "Criar pedido"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}