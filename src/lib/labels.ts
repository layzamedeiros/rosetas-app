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