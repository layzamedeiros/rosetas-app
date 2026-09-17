import { Header } from "@/components/storefront/header";
import { CONTACT } from "@/lib/constants";
import { productCategoryLabels } from "@/lib/labels";
import prisma from "@/lib/prisma";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.active) {
    notFound();
  }

  const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product.title}`);
  const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${message}`;

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Header />

      <article className="mx-auto w-full max-w-7xl grow px-6 pb-24 pt-32 md:px-12 lg:px-24">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Voltar para o início
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">

          <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-secondary shadow-sm">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sem imagem disponível
              </div>
            )}
          </div>

          <div className="flex flex-col pt-2 lg:pt-10">
            <header>
              <div className="mb-6 inline-flex w-fit rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary md:text-xs">
                {productCategoryLabels[product.category]}
              </div>

              <h1 className="mb-6 font-display text-4xl leading-tight text-deep md:text-5xl lg:text-6xl">
                {product.title}
              </h1>
            </header>

            <div className="mb-8 h-px w-full bg-border" />

            <div className="mb-10 text-sm leading-relaxed text-muted-foreground md:text-base">
              {product.description.split('\n').map((line, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {line}
                </p>
              ))}
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 md:w-fit md:px-6 md:text-base"
            >
              <MessageCircle size={20} className="transition-transform group-hover:scale-110" />
              Orçar este produto
            </a>

            <p className="mt-4 text-center text-xs text-muted-foreground md:text-left">
              Ao clicar, você será direcionado(a) para o nosso atendimento via WhatsApp.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}