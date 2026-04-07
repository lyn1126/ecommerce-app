import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock must be at least 0"),
  images: z.array(z.string().min(1, "Image is required")).min(1, "At least one image is required"),
  featured: z.coerce.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
});

export const checkoutItemSchema = z.object({
  productId: z.string().cuid("Invalid product id"),
  quantity: z.coerce.number().int().positive(),
});

export const checkoutSchema = z.object({
  email: z.email("Invalid email"),
  items: z.array(checkoutItemSchema).min(1, "Cart is empty"),
});
