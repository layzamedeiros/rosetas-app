"use client";

import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro interno capturado pelo Next.js:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center animate-in fade-in zoom-in-95 duration-500">

      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle size={48} strokeWidth={1.5} />
      </div>

      <h1 className="mb-4 font-display text-6xl tracking-tight text-foreground md:text-8xl">
        500
      </h1>

      <h2 className="mb-3 text-xl font-medium md:text-2xl">
        Ops! Algo deu errado.
      </h2>

      <p className="mx-auto mb-10 max-w-md leading-relaxed text-muted-foreground">
        Ocorreu um erro inesperado em nossos servidores. Nossa equipe técnica já foi notificada. Por favor, tente recarregar ou volte mais tarde.
      </p>

      <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Ir para o início
        </Link>

        <button
          onClick={() => reset()}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
        >
          <RefreshCcw size={16} className="transition-transform group-hover:-rotate-180 duration-500" />
          Tentar novamente
        </button>
      </div>

    </main>
  );
}