"use client";

import { productCategoryLabels } from "@/lib/labels";
import { ChevronDown, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estado local para a busca (permite digitação fluida)
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "ALL") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Busca em tempo real (Debounce de 400ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (query === currentQ) return; // Evita requisições redundantes

      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, pathname, router, searchParams]);

  const hasFilters = searchParams.toString() !== "";

  function clearFilters() {
    setQuery("");
    router.push(pathname);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] max-w-sm flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="relative">
        <select
          value={searchParams.get("category") || "ALL"}
          onChange={(e) =>
            router.push(`${pathname}?${createQueryString("category", e.target.value)}`)
          }
          className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary cursor-pointer"
        >
          <option value="ALL">Todas as categorias</option>
          {Object.entries(productCategoryLabels).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>

      <div className="relative">
        <select
          value={searchParams.get("status") || "ALL"}
          onChange={(e) =>
            router.push(`${pathname}?${createQueryString("status", e.target.value)}`)
          }
          className="appearance-none rounded-full border border-border bg-card py-2 pl-4 pr-10 text-sm outline-none transition-colors focus:border-primary cursor-pointer"
        >
          <option value="ALL">Todos os status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="INACTIVE">Inativos</option>
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X size={14} />
          Limpar filtros
        </button>
      )}
    </div>
  );
}