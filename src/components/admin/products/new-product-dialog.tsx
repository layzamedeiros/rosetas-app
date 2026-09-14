"use client";

import { createProduct } from "@/app/admin/produtos/actions";
import { Plus, X } from "lucide-react";
import { useRef } from "react";
import { ProductForm } from "./product-form";

export function NewProductDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus size={16} />
        Novo produto
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(e) => { e.preventDefault(); closeDialog(); }}
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl border-none bg-background p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:flex open:flex-col"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
          <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-display text-2xl">Novo produto</h2>
              <p className="mt-1 text-sm text-muted-foreground">Cadastre um produto para exibir no catálogo.</p>
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
              onSuccess={closeDialog}
              onSubmit={async (data, file) => {
                const formData = new FormData();
                formData.set("title", data.title);
                formData.set("category", data.category);
                formData.set("description", data.description);
                formData.set("active", String(data.active));
                if (file) formData.set("image", file);
                return createProduct(formData);
              }}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}