"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

function revalidateProductPaths(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  for (const slug of slugs) {
    revalidatePath(`/products/${slug}`);
  }
}

function parseProductFormData(formData: FormData) {
  const rawImages = formData.getAll("images").map((value) => String(value).trim());
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slugSource = rawSlug || name;
  const normalizedSlug = slugify(slugSource, { lower: true, strict: true, trim: true });

  return {
    name,
    slug: normalizedSlug,
    description: String(formData.get("description") ?? ""),
    price: Number(formData.get("price") ?? 0),
    originalPrice: String(formData.get("originalPrice") ?? "").trim(),
    stock: Number(formData.get("stock") ?? 0),
    images: rawImages.filter(Boolean),
    featured: String(formData.get("featured") ?? "") === "true",
    categoryId: String(formData.get("categoryId") ?? ""),
  };
}

export async function createProduct(formData: FormData) {
  const parsed = productSchema.safeParse(parseProductFormData(formData));

  if (!parsed.success) {
    console.error("createProduct validation failed", parsed.error.flatten().fieldErrors);
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.product.create({ data: parsed.data });
  } catch (error) {
    console.error("createProduct database error", error);
    return {
      ok: false,
      errors: {
        slug: ["Slug already exists or invalid relation data."],
      },
    };
  }

  revalidateProductPaths([parsed.data.slug]);
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const parsed = productSchema.safeParse(parseProductFormData(formData));

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidateProductPaths(
    [existingProduct?.slug, parsed.data.slug].filter((slug): slug is string => Boolean(slug)),
  );
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.product.delete({ where: { id } });

  revalidateProductPaths(product?.slug ? [product.slug] : []);

  return { ok: true };
}
