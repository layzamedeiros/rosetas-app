import { HistoryFilters } from "@/components/admin/orders/history-filters";
import { HistoryList } from "@/components/admin/orders/history-list";
import { getOrderHistory } from "@/lib/data/orders";
import { getActiveProducts } from "@/lib/data/products";

export default async function HistoryPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;

  const [orders, products] = await Promise.all([
    getOrderHistory(searchParams),
    getActiveProducts(),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="eyebrow mb-2">ARQUIVO GERAL</p>
        <h1 className="font-display text-3xl">Histórico de Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulte o registro completo de todas as vendas e pedidos finalizados.
        </p>
      </div>

      <HistoryFilters />

      <HistoryList orders={orders} products={products} />
    </div>
  );
}