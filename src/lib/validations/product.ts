import { z } from "zod";

export const productSchema = z.object({
  title: z.string().trim().min(1, "Nome é obrigatório."),
  category: z.enum([
    "INVITES",
    "STATIONERY",
    "TABLE_DECOR",
    "PACKAGING",
    "FAVORS_KITS",
    "BRANDING",
  ]),
  description: z.string().trim().min(1, "Descrição é obrigatória."),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;