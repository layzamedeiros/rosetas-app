"use client";

import { cn } from "@/lib/utils";

export function WaxSeal({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "gold-wax-seal relative flex h-28 w-28 cursor-pointer items-center justify-center outline-none",
        className
      )}
      aria-label="Rolar para baixo"
    >
      <span className="wax-text-engraved relative z-10 font-display text-5xl italic tracking-widest">
        R
      </span>
    </button>
  );
}