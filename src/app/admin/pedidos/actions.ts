"use server";

import type { Order } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { orderSchema } from "@/lib/validations/order";
import { revalidatePath } from "next/cache";

export async function createOrder(data: unknown) {
  const parsed = orderSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const input = parsed.data;

  try {
    await prisma.order.create({
      data: {
        customerName: input.customerName.trim(),
        customerWhatsapp: input.customerWhatsapp.trim(),
        eventDate: input.eventDate ? new Date(`${input.eventDate}T12:00:00`) : null,
        notes: input.notes?.trim() || null,
        priority: input.priority,
        status: input.status || "NEW",
        items: {
          create: input.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao criar pedido." };
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar status do pedido." };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao excluir pedido." };
  }
}

export async function updateOrder(orderId: string, data: unknown) {
  const parsed = orderSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const input = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          customerName: input.customerName.trim(),
          customerWhatsapp: input.customerWhatsapp.trim(),
          eventDate: input.eventDate ? new Date(`${input.eventDate}T12:00:00`) : null,
          notes: input.notes?.trim() || null,
          priority: input.priority,
          status: input.status,
        },
      });

      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      await tx.orderItem.createMany({
        data: input.items.map((item) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    });

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao atualizar pedido." };
  }
}