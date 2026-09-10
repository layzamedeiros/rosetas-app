"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 w-full max-w-xs p-3 rounded-lg bg-card border border-border text-foreground font-sans text-sm backdrop-blur-sm transition-all duration-200",
          title: "font-medium text-foreground text-sm",
          description: "text-xs text-muted-foreground mt-0.5",
          actionButton:
            "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90",
          cancelButton:
            "rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/80",
          success:
            "!border-primary/40 !bg-card text-foreground [&_[data-icon]]:text-primary",
          error:
            "!border-destructive/30 !bg-destructive/5 text-destructive [&_[data-icon]]:text-destructive",
          warning:
            "!border-sand !bg-secondary/40 text-foreground [&_[data-icon]]:text-deep",
          info:
            "!border-border !bg-card text-foreground [&_[data-icon]]:text-muted-foreground",
        },
      }}
    />
  );
}