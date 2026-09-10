"use client";

import type { Product } from "@/generated/prisma/client";
import type { OrderFormValues } from "@/lib/validations/order";
import { ChevronDown, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type OrderItemCardProps = {
  index: number;
  products: Product[];
  itemsLength: number;
  removeItem: (index: number) => void;
  form: UseFormReturn<OrderFormValues>;
};

export function OrderItemCard({
  index,
  products,
  itemsLength,
  removeItem,
  form,
}: OrderItemCardProps) {
  const { register, setValue, watch } = form;

  const currentPrice = watch(`items.${index}.unitPrice`);

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="eyebrow">Item {String(index + 1).padStart(2, "0")}</p>
        <button
          type="button"
          onClick={() => removeItem(index)}
          disabled={itemsLength === 1}
          aria-label={`Remover item ${index + 1}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mb-4 min-w-0">
        <label htmlFor={`product-${index}`} className="eyebrow mb-1.5 block">
          Produto
        </label>
        <div className="relative">
          <select
            id={`product-${index}`}
            {...register(`items.${index}.productId`)}
            className="w-full min-w-0 appearance-none rounded-lg border border-border bg-card px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground"
          />
        </div>
        {form.formState.errors.items?.[index]?.productId && (
          <span className="text-xs text-destructive mt-1 block">
            {form.formState.errors.items[index]?.productId?.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`quantity-${index}`} className="eyebrow mb-1.5 block">
            Quantidade
          </label>
          <input
            id={`quantity-${index}`}
            type="number"
            min={1}
            {...register(`items.${index}.quantity`)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor={`price-${index}`} className="eyebrow mb-1.5 block">
            Valor unit
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              R$
            </span>
            <input
              id={`price-${index}`}
              type="number"
              min={0}
              step="0.01"
              value={currentPrice === 0 ? "" : currentPrice / 100}
              onChange={(e) => {
                const value = e.target.value;
                setValue(
                  `items.${index}.unitPrice`,
                  value === "" ? 0 : Math.round(Number(value) * 100)
                );
              }}
              className="w-full rounded-lg border border-border bg-card pl-9 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}