import Link from "next/link";

import { createProduct } from "@/actions/products";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function createProductAction(formData: FormData) {
    "use server";

    await createProduct(formData);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline">Admin</Badge>
          <h1 className="text-4xl font-semibold">Quản lý sản phẩm</h1>
          <p className="text-base text-muted-foreground">
            Tạo sản phẩm mới, chỉnh sửa nội dung và kiểm soát danh mục hiển thị trên storefront.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/orders" className={cn(buttonVariants({ variant: "outline" }))}>
            Quản lý đơn hàng
          </Link>
          <Link href="/products" className={cn(buttonVariants({}))}>
            Xem storefront
          </Link>
        </div>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Tạo sản phẩm mới</CardTitle>
          <CardDescription>Slug có thể để trống, hệ thống sẽ tự tạo từ tên sản phẩm.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProductAction} className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Tên sản phẩm" required />
            <Input name="slug" placeholder="Slug (vd: ao-so-mi-nu)" />
            <Input name="price" type="number" min="1" step="1" placeholder="Giá bán" required />
            <Input name="originalPrice" type="number" min="1" step="1" placeholder="Giá gốc (tùy chọn)" />
            <Input name="stock" type="number" min="0" step="1" placeholder="Tồn kho" required />
            <select
              name="categoryId"
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Input name="images" placeholder="URL ảnh chính" required />
            <Textarea
              name="description"
              placeholder="Mô tả sản phẩm"
              className="min-h-28 md:col-span-2"
              required
            />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" name="featured" value="true" className="size-4 accent-black" />
              Đánh dấu là sản phẩm nổi bật
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Tạo sản phẩm</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>{products.length} sản phẩm hiện có trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Giá gốc</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{Number(product.price).toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>
                    {product.originalPrice ? `${Number(product.originalPrice).toLocaleString("vi-VN")} VND` : "—"}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.featured ? "default" : "outline"}>
                      {product.featured ? "Có" : "Không"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Sửa
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
