import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProduct } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const productId = product.id;

  async function updateProductAction(formData: FormData) {
    "use server";

    await updateProduct(productId, formData);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline">Product edit</Badge>
          <h1 className="text-4xl font-semibold">Chỉnh sửa sản phẩm</h1>
          <p className="text-base text-muted-foreground">Cập nhật nội dung hiển thị và trạng thái tồn kho.</p>
        </div>
        <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }))}>
          Quay lại danh sách
        </Link>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>Thay đổi sẽ được áp dụng ngay cho storefront sau khi lưu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProductAction} className="grid gap-4">
            <Input name="name" defaultValue={product.name} required />
            <Input name="slug" defaultValue={product.slug} required />
            <Textarea name="description" defaultValue={product.description} className="min-h-32" required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input type="number" name="price" defaultValue={Number(product.price)} required />
              <Input
                type="number"
                name="originalPrice"
                defaultValue={product.originalPrice ? Number(product.originalPrice) : ""}
                placeholder="Giá gốc (tùy chọn)"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input type="number" name="stock" defaultValue={product.stock} required />
              <select
                name="categoryId"
                defaultValue={product.categoryId}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Input name="images" defaultValue={product.images[0] ?? ""} required />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                value="true"
                defaultChecked={product.featured}
                className="size-4 accent-black"
              />
              Sản phẩm nổi bật
            </label>
            <div className="flex gap-3">
              <Button type="submit">Lưu thay đổi</Button>
              <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }))}>
                Hủy
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
