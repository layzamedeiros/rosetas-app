import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().min(1, "A quantidade deve ser maior que zero"),
  unitPrice: z.coerce.number().min(0, "O valor não pode ser negativo"),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "O nome do cliente é obrigatório"),
  customerWhatsapp: z.string().min(8, "O WhatsApp é obrigatório"),
  eventDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  status: z.enum(["NEW", "QUOTE_SENT", "IN_PRODUCTION", "READY", "DELIVERED"]).optional(),
  items: z.array(orderItemSchema).min(1, "O pedido precisa ter pelo menos um produto"),
});

export type OrderFormValues = z.infer<typeof orderSchema>;