import { BudgetSection } from "@/components/storefront/budget-section";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { Footer } from "@/components/storefront/footer";
import { Header } from "@/components/storefront/header";
import { Hero } from "@/components/storefront/hero";
import { HowItWorks } from "@/components/storefront/how-it-works";
import { InstagramGallery } from "@/components/storefront/instagram-gallery";
import { OurEssence } from "@/components/storefront/our-essence";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { category: "asc" },
  });

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Header />
      <Hero />

      <section id="destaques" className="bg-[#FDFBF7] py-24 md:py-32">
        <FeaturedProducts products={products} />
      </section>

      <div className="bg-background py-24 md:py-32">
        <HowItWorks />
      </div>

      <OurEssence />
      <InstagramGallery />
      <BudgetSection />
      <Footer />
    </main>
  );
}