"use client";

import { productCategoryLabels } from "@/lib/labels";
import { ProductFormValues, productSchema } from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ProductFormProps = {
  onSuccess: () => void;
  onSubmit: (
    data: ProductFormValues,
    file: File | null,
    imageRemoved: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    title: string;
    category: ProductFormValues["category"];
    description: string;
    imageUrl: string | null;
    active: boolean;
  };
};

export function ProductForm({ onSuccess, onSubmit, initialData }: ProductFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const isEditing = Boolean(initialData);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      category: initialData?.category ?? "FAVORS_KITS",
      description: initialData?.description ?? "",
      active: initialData?.active ?? true,
    },
  });

  function handleFileChange(selectedFile: File | undefined) {
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    setFile(selectedFile);
    setImageRemoved(false);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function removeImage() {
    setFile(null);
    setPreview(null);
    setImageRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const response = await onSubmit(data, file, imageRemoved);
    if (!response.success) {
      toast.error(response.error || "Erro ao salvar produto.");
      return;
    }
    toast.success(isEditing ? "Produto atualizado!" : "Produto criado!");
    onSuccess();
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(form.formState.errors).length > 0 && (
        <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Verifique os campos em vermelho antes de prosseguir.
        </div>
      )}

      <div>
        <label htmlFor="title" className="eyebrow mb-1.5 block">Nome</label>
        <input
          id="title"
          {...form.register("title")}
          placeholder="Ex.: Convite de casamento"
          className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary ${form.formState.errors.title ? "border-destructive" : "border-border"
            }`}
        />
      </div>

      <div>
        <label htmlFor="category" className="eyebrow mb-1.5 block">Categoria</label>
        <div className="relative">
          <select
            id="category"
            {...form.register("category")}
            className={`appearance-none w-full cursor-pointer rounded-lg border bg-card px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary ${form.formState.errors.category ? "border-destructive" : "border-border"
              }`}
          >
            {Object.entries(productCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="eyebrow mb-1.5 block">Descrição</label>
        <textarea
          id="description"
          {...form.register("description")}
          rows={3}
          placeholder="Ex.: Convite personalizado para casamento..."
          className={`w-full resize-none rounded-lg border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary ${form.formState.errors.description ? "border-destructive" : "border-border"
            }`}
        />
      </div>

      <div>
        <p className="eyebrow mb-1.5">Imagem</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
        {preview ? (
          <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-secondary">
            <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background/90 shadow-sm"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ImagePlus size={20} />
            <span className="text-sm">Selecionar imagem</span>
            <span className="text-xs">JPG, PNG ou WebP – 5 MB</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Produto ativo</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Exibir este produto na landing page.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.watch("active")}
          onClick={() => form.setValue("active", !form.getValues("active"))}
          className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors ${form.watch("active") ? "bg-primary" : "bg-muted"
            }`}
        >
          <span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.watch("active") ? "translate-x-5" : "translate-x-0"
            }`} />
        </button>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onSuccess}
          disabled={form.formState.isSubmitting}
          className="rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Salvando..." : isEditing ? "Salvar" : "Criar produto"}
        </button>
      </div>
    </form>
  );
}