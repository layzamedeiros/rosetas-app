import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
      <p className="mt-4 text-sm font-medium tracking-wide text-muted-foreground uppercase">
        Carregando dados...
      </p>
    </div>
  );
}