"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro capturado pela Boundary:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6 animate-in zoom-in-95 duration-300">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>

        <h2 className="font-display text-2xl mb-2 text-foreground">
          Ocorreu um erro de conexão
        </h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Não foi possível carregar as informações do servidor no momento. Verifique sua conexão com a internet ou tente novamente.
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
        >
          <RefreshCcw size={16} />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}