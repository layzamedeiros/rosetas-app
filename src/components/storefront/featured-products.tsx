import type { Product } from "@/generated/prisma/client";
import { productCategoryLabels } from "@/lib/labels";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.slice(8, 12);

  return (
    <section className="mx-auto px-4 md:px-12 lg:px-30">
      <header className="mb-10 flex flex-col md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3 text-primary md:mb-4">PRODUTOS</p>
          <h2 className="font-display text-4xl leading-tight text-deep md:text-5xl">
            Feito para o seu momento
          </h2>
          <svg
            className="mt-4 h-4 w-32 text-primary/40 md:mt-6 md:h-5 md:w-30"
            viewBox="0 0 100 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            preserveAspectRatio="none"
          >
            <path d="M0,10 Q25,20 50,10 T100,10" />
          </svg>
        </div>

        <Link
          href="/produtos"
          className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 md:flex"
        >
          Ver catálogo <ArrowRight size={16} />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-6">
        {featured.map((product) => (
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
                  sizes="(max-width: 768px) 50vw, 25vw"
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
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="md:h-4 md:w-4"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/produtos"
          className="flex w-full items-center justify-center rounded-full border border-border bg-transparent px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
        >
          Ver todo o catálogo
        </Link>
      </div>
    </section>
  );
}