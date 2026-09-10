"use client";

import { Sidebar } from "@/components/admin/sidebar";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  const NotFoundContent = (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileQuestion size={48} strokeWidth={1.5} />
      </div>

      <h1 className="mb-4 font-display text-6xl tracking-tight text-foreground md:text-8xl">
        404
      </h1>

      <h2 className="mb-3 text-xl font-medium md:text-2xl">
        Página não encontrada
      </h2>

      <p className="mx-auto mb-10 max-w-md leading-relaxed text-muted-foreground">
        Parece que o papel voou da mesa. A página que você tentou acessar não existe, foi movida ou o endereço está incorreto.
      </p>

      <Link
        href={isAdmin ? "/admin" : "/"}
        className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Voltar para {isAdmin ? "o Dashboard" : "a Página Inicial"}
      </Link>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background/90">
          {NotFoundContent}
        </main>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      {NotFoundContent}
    </main>
  );
}