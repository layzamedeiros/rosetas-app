"use client";

import type { Product } from "@/generated/prisma/client";
import { CONTACT } from "@/lib/constants";
import { productCategoryLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function Catalog({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredProducts = activeCategory === "ALL"
    ? products
    : products.filter(p => p.category === activeCategory);

  const availableCategories = Array.from(new Set(products.map(p => p.category)));

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-12 lg:px-24">
      <header className="mb-10 md:mb-12">
        <p className="eyebrow mb-3 md:mb-4 text-primary">PRODUTOS</p>
        <h2 className="font-display text-4xl leading-tight text-deep md:text-5xl">
          Feito para o seu <br className="hidden md:block" />
          momento
        </h2>
        <svg className="mt-4 md:mt-6 h-2 md:h-3 w-20 md:w-24 text-primary/40" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0,10 Q25,20 50,10 T100,10" />
        </svg>
      </header>

      <nav aria-label="Filtro de categorias" className="scrollbar-hide -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-10 md:flex-wrap md:gap-3 md:px-0">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={cn(
            "shrink-0 rounded-full border px-5 py-1.5 text-[13px] md:text-sm font-medium transition-all duration-300",
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
              "shrink-0 rounded-full border px-5 py-1.5 text-[13px] md:text-sm font-medium transition-all duration-300",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {productCategoryLabels[cat as keyof typeof productCategoryLabels]}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
        {filteredProducts.map((product) => {
          const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.title}`);
          const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;

          return (
            <a
              key={product.id}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer flex-col outline-none"
            >
              <div className="relative mb-3 md:mb-5 aspect-4/5 w-full overflow-hidden rounded-xl md:rounded-2xl bg-secondary">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] md:text-xs text-muted-foreground">
                    Sem imagem
                  </div>
                )}
                <div className="absolute left-2 top-2 md:left-4 md:top-4 rounded-full bg-background/90 px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-medium uppercase tracking-wider text-deep backdrop-blur-sm">
                  {productCategoryLabels[product.category]}
                </div>
              </div>

              <h3 className="font-display text-lg leading-tight text-deep transition-colors group-hover:text-primary md:text-2xl">
                {product.title}
              </h3>
              <p className="mt-1.5 md:mt-2 line-clamp-2 text-[13px] md:text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-2.5 md:mt-4 flex items-center gap-1 text-[13px] md:text-sm font-medium text-primary">
                Orçar produto
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-4 md:w-4" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}