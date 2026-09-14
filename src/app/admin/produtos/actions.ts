"use server";

import prisma from "@/lib/prisma";
import supabaseAdmin from "@/lib/supabase-admin";
import { productSchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

async function uploadImage(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return { success: false as const, error: "A imagem deve ter no máximo 5 MB." };
  }

  const extension = ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES];
  if (!extension) {
    return { success: false as const, error: "Formato inválido. Use JPG, PNG ou WebP." };
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return { success: false as const, error: error.message };
  }

  const { data } = supabaseAdmin.storage.from("products").getPublicUrl(path);
  return { success: true as const, url: data.publicUrl, path };
}

async function deleteImage(imageUrl: string | null) {
  if (!imageUrl) return;
  const marker = "/storage/v1/object/public/products/";
  if (!imageUrl.includes(marker)) return;
  const path = decodeURIComponent(imageUrl.split(marker)[1]);
  await supabaseAdmin.storage.from("products").remove([path]);
}

export async function createProduct(formData: FormData) {
  const file = formData.get("image");
  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    active: formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    let imageUrl: string | null = null;
    let uploadedPath: string | null = null;

    if (file instanceof File && file.size > 0) {
      const upload = await uploadImage(file);
      if (!upload.success) return upload;
      imageUrl = upload.url;
      uploadedPath = upload.path;
    }

    try {
      await prisma.product.create({
        data: { ...parsed.data, imageUrl },
      });
    } catch (error) {
      if (uploadedPath) {
        await supabaseAdmin.storage.from("products").remove([uploadedPath]);
      }
      throw error;
    }

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao criar produto." };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const file = formData.get("image");
  const shouldRemoveImage = formData.get("removeImage") === "true";

  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    active: formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return { success: false, error: "Produto não encontrado." };

    let imageUrl = product.imageUrl;
    let uploadedPath: string | null = null;

    if (shouldRemoveImage && product.imageUrl) {
      await deleteImage(product.imageUrl);
      imageUrl = null;
    } else if (file instanceof File && file.size > 0) {
      const upload = await uploadImage(file);
      if (!upload.success) return upload;
      imageUrl = upload.url;
      uploadedPath = upload.path;
    }

    try {
      await prisma.product.update({
        where: { id: productId },
        data: { ...parsed.data, imageUrl },
      });
    } catch (error) {
      if (uploadedPath) {
        await supabaseAdmin.storage.from("products").remove([uploadedPath]);
      }
      throw error;
    }

    if (uploadedPath && product.imageUrl && !shouldRemoveImage) {
      await deleteImage(product.imageUrl);
    }

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao atualizar produto." };
  }
}

export async function toggleProductActive(productId: string, active: boolean) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { active },
    });
    revalidatePath("/admin/produtos");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Erro ao atualizar produto." };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!product) return { success: false, error: "Produto não encontrado." };

    if (product._count.orderItems > 0) {
      return {
        success: false,
        error: "Não é possível excluir: produto já vinculado a pedidos. Desative-o.",
      };
    }

    await prisma.product.delete({ where: { id: productId } });
    await deleteImage(product.imageUrl);

    revalidatePath("/admin/produtos");
    revalidatePath("/");
    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch {
    return { success: false, error: "Erro interno ao excluir produto." };
  }
}