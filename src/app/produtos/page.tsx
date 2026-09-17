import { FullCatalog } from "@/components/storefront/full-catalog";
import { Header } from "@/components/storefront/header";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Catálogo | Rosetas Personalizados",
  description: "Conheça nossa linha completa de convites, papelaria e detalhes afetivos para o seu evento.",
};

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
  });

  return (
    <main className="flex min-h-screen flex-col bg-[#FDFBF7] selection:bg-primary/20 selection:text-primary">
      <Header />

      <div className="grow pb-24 pt-32 md:pt-40">
        <FullCatalog products={products} />
      </div>
    </main>
  );
}