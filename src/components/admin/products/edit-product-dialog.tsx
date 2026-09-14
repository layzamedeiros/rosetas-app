"use client";

import { updateProduct } from "@/app/admin/produtos/actions";
import type { Product } from "@/generated/prisma/client";
import { Pencil, X } from "lucide-react";
import { useRef } from "react";
import { ProductForm } from "./product-form";

export function EditProductDialog({ product }: { product: Product }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[11px] transition-colors hover:bg-secondary"
      >
        <Pencil size={12} />
        Editar
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(e) => { e.preventDefault(); closeDialog(); }}
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl border-none bg-background p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
          <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-display text-2xl">Editar produto</h2>
              <p className="mt-1 text-sm text-muted-foreground">Atualize as informações deste produto.</p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 overflow-y-auto px-6 py-6">
            <ProductForm
              initialData={{
                title: product.title,
                category: product.category,
                description: product.description,
                imageUrl: product.imageUrl,
                active: product.active,
              }}
              onSuccess={closeDialog}
              onSubmit={async (data, file, imageRemoved) => {
                const formData = new FormData();
                formData.set("title", data.title);
                formData.set("category", data.category);
                formData.set("description", data.description);
                formData.set("active", String(data.active));
                if (imageRemoved) formData.set("removeImage", "true");
                if (file) formData.set("image", file);
                return updateProduct(product.id, formData);
              }}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}