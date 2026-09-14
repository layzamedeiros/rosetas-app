"use client";

import { deleteProduct, toggleProductActive } from "@/app/admin/produtos/actions";
import type { Prisma } from "@/generated/prisma/client";
import { productCategoryLabels } from "@/lib/labels";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useOptimistic, useRef, useTransition } from "react";
import { toast } from "sonner";
import { EditProductDialog } from "./edit-product-dialog";

type ProductWithCount = Prisma.ProductGetPayload<{
  include: { _count: { select: { orderItems: true } } };
}>;

export function ProductCard({ product }: { product: ProductWithCount }) {
  const [isPending, startTransition] = useTransition();
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const [optimisticActive, setOptimisticActive] = useOptimistic(
    product.active,
    (_, newStatus: boolean) => newStatus
  );

  const isDeletable = product._count.orderItems === 0;

  function handleDelete() {
    startTransition(async () => {
      const response = await deleteProduct(product.id);
      if (!response.success) {
        toast.error(response.error);
        return;
      }
      toast.success("Produto excluído com sucesso!");
      deleteDialogRef.current?.close();
    });
  }

  function handleToggleActive() {
    startTransition(async () => {
      const newStatus = !optimisticActive;
      setOptimisticActive(newStatus);
      const response = await toggleProductActive(product.id, newStatus);
      if (!response.success) {
        toast.error("Erro ao alterar status do produto.");
      }
    });
  }

  return (
    <>
      <div className="flex h-32 gap-3 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md">
        <div className="relative h-full w-28 shrink-0 overflow-hidden rounded-lg bg-secondary">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
              Sem foto
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="eyebrow text-[10px]">{productCategoryLabels[product.category]}</p>
          <h2 className="truncate text-[18px] font-medium">{product.title}</h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">{product.description}</p>

          <div className="mt-auto flex items-center justify-between">
            <button
              type="button"
              onClick={handleToggleActive}
              className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-secondary"
            >
              <span className={`h-2 w-2 rounded-full transition-colors ${optimisticActive ? "bg-primary" : "bg-muted-foreground"}`} />
              <span className="text-[11px] text-muted-foreground font-medium">
                {optimisticActive ? "Ativo" : "Inativo"}
              </span>
            </button>
            <div className="flex items-center gap-0.5">
              <EditProductDialog product={product} />
              <button
                type="button"
                onClick={() => deleteDialogRef.current?.showModal()}
                disabled={isPending || !isDeletable}
                title={!isDeletable ? "Vinculado a pedidos. Desative." : "Excluir"}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={deleteDialogRef}
        onCancel={(e) => { e.preventDefault(); if (!isPending) deleteDialogRef.current?.close(); }}
        className="m-auto w-full max-w-sm rounded-2xl border-none bg-background p-5 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
      >
        <h3 className="font-display text-xl">Excluir produto?</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Você está prestes a excluir <span className="font-medium text-foreground">{product.title}</span>. Essa ação não poderá ser desfeita.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => deleteDialogRef.current?.close()}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-sm transition-colors hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Excluindo..." : "Excluir produto"}
          </button>
        </div>
      </dialog>
    </>
  );
}