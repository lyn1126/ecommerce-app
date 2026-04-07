import { SearchIcon } from "lucide-react";

import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  stock?: "in-stock" | "out-of-stock";
  sort?: "price-asc" | "newest" | "featured";
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category, minPrice, maxPrice, q, stock, sort } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        AND: [
          category ? { category: { slug: category } } : {},
          minPrice ? { price: { gte: Number(minPrice) } } : {},
          maxPrice ? { price: { lte: Number(maxPrice) } } : {},
          stock === "in-stock" ? { stock: { gt: 0 } } : {},
          stock === "out-of-stock" ? { stock: 0 } : {},
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      include: { category: true },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { featured: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
      <section className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit">
          Curated collection
        </Badge>
        <h1 className="text-4xl font-semibold md:text-5xl">Sản phẩm</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Lọc nhanh theo danh mục, mức giá và trạng thái tồn kho để tìm đúng món đồ cho phong cách bạn muốn.
        </p>
      </section>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Bộ lọc mua sắm</CardTitle>
          <CardDescription>URL sẽ phản ánh trạng thái lọc để bạn có thể chia sẻ lại ngay.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="q" defaultValue={q ?? ""} placeholder="Tìm sản phẩm" className="pl-9" />
              </div>
            </div>
            <select
              name="category"
              defaultValue={category ?? ""}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <Input type="number" name="minPrice" min="0" defaultValue={minPrice ?? ""} placeholder="Giá từ" />
            <Input type="number" name="maxPrice" min="0" defaultValue={maxPrice ?? ""} placeholder="Giá đến" />
            <div className="flex gap-3 xl:col-span-2">
              <select
                name="stock"
                defaultValue={stock ?? ""}
                className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="in-stock">Còn hàng</option>
                <option value="out-of-stock">Hết hàng</option>
              </select>
              <select
                name="sort"
                defaultValue={sort ?? "featured"}
                className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="featured">Nổi bật</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
              </select>
              <Button type="submit">Lọc</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={!category ? "default" : "outline"}>Tất cả</Badge>
        {categories.map((item) => (
          <Badge key={item.id} variant={category === item.slug ? "default" : "outline"}>
            {item.name}
          </Badge>
        ))}
        <span className="ml-auto text-sm text-muted-foreground">Tìm thấy {products.length} sản phẩm</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: Number(product.price),
            }}
          />
        ))}
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-card/70">
          <CardContent className="py-10 text-center text-muted-foreground">
            Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
