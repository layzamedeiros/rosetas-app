import { NewProductDialog } from "@/components/admin/products/new-product-dialog";
import { ProductFilters } from "@/components/admin/products/product-filters";
import { ProductGrid } from "@/components/admin/products/product-grid";
import { getAllProducts } from "@/lib/data/products";

export default async function ProductsPage(props: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const products = await getAllProducts(searchParams);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="eyebrow mb-2">CATÁLOGO</p>
          <h1 className="font-display text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os produtos e vitrines do sistema
          </p>
        </div>
        <NewProductDialog />
      </div>

      <ProductFilters />

      <ProductGrid products={products} />
    </div>
  );
}