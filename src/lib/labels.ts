import { ProductCategory } from "@/generated/prisma/client";

export const orderStatusLabels: Record<string, string> = {
  NEW: "Novo pedido",
  QUOTE_SENT: "Orçamento enviado",
  IN_PRODUCTION: "Em produção",
  READY: "Pronto",
  DELIVERED: "Entregue",
};

export const orderStatusOrder = [
  "NEW",
  "QUOTE_SENT",
  "IN_PRODUCTION",
  "READY",
  "DELIVERED",
] as const;

export const priorityLabels: Record<string, string> = {
  LOW: "Baixa",
  NORMAL: "Normal",
  HIGH: "Alta",
};

export const productCategoryLabels = {
  INVITES: "Convites",
  STATIONERY: "Papelaria",
  TABLE_DECOR: "Mesa & Decoração",
  PACKAGING: "Embalagens",
  FAVORS_KITS: "Lembranças & Kits",
  BRANDING: "Identidade Visual",
} satisfies Record<ProductCategory, string>;