"use client";

import type { Product } from "@/generated/prisma/client";
import { productCategoryLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function FullCatalog({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredProducts = activeCategory === "ALL"
    ? products
    : products.filter(p => p.category === activeCategory);

  const availableCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="mx-auto px-4 md:px-12 lg:px-30">

      <header className="mb-10 text-center md:mb-16 md:text-left">
        <h1 className="font-display text-4xl leading-tight text-deep md:text-5xl lg:text-6xl">
          Nosso <span className="italic text-primary">Catálogo</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:mx-0 md:text-base">
          Explore todas as nossas criações. Detalhes pensados para eternizar cada momento da sua história.
        </p>
      </header>

      <div className="scrollbar-hide -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-12 md:flex-wrap md:gap-3 md:px-0">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={cn(
            "shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition-all duration-300 md:text-sm",
            activeCategory === "ALL"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          Todos
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2 text-[13px] font-medium transition-all duration-300 md:text-sm",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {productCategoryLabels[cat as keyof typeof productCategoryLabels]}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.id}`}
              className="group flex cursor-pointer flex-col outline-none"
            >
              <div className="relative mb-3 aspect-4/5 w-full overflow-hidden rounded-xl bg-secondary md:mb-5 md:rounded-2xl">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground md:text-xs">
                    Sem imagem
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-deep backdrop-blur-sm md:left-4 md:top-4 md:px-3 md:py-1 md:text-[10px]">
                  {productCategoryLabels[product.category]}
                </div>
              </div>

              <h3 className="font-display text-lg leading-tight text-deep transition-colors group-hover:text-primary md:text-xl">
                {product.title}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors group-hover:text-primary md:mt-3 md:text-sm">
                Ver detalhes
                <ArrowRight size={14} className="md:h-4 md:w-4" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}