import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ProductCard } from "@/components/store/product-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function StoreHomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 5,
    }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 md:py-12">
      <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm shadow-black/5 md:grid-cols-[1.15fr_0.85fr] md:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-5">
            <Badge variant="outline" className="w-fit">
              Fashion capsule 2026
            </Badge>
            <div className="flex flex-col gap-4">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
                Tủ đồ nữ tính, hiện đại và gọn gàng cho mọi ngày trong tuần.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground">
                Maison Nha tuyển chọn những thiết kế dễ mặc, tinh tế và đúng tinh thần thời trang ứng dụng
                cho đi làm, dạo phố và cuối tuần.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}>
              Khám phá bộ sưu tập
            </Link>
            <Link
              href="/admin/products"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-6")}
            >
              Vào trang quản trị
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-[1.5rem] bg-primary px-6 py-8 text-primary-foreground">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.25em] text-primary-foreground/70">Danh mục nổi bật</p>
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex items-center justify-between border-b border-primary-foreground/15 py-3 text-lg"
                >
                  <span>{category.name}</span>
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          <p className="max-w-sm text-sm leading-6 text-primary-foreground/75">
            Giao diện mới theo tinh thần fashion: tối giản, editorial, đậm tính trưng bày sản phẩm nhưng vẫn
            giữ luồng mua hàng và quản trị mạch lạc.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Featured edit</p>
            <h2 className="text-3xl font-semibold">Những thiết kế đang được quan tâm</h2>
          </div>
          <Link href="/products" className={cn(buttonVariants({ variant: "ghost" }))}>
            Xem tất cả
          </Link>
        </div>
        <Separator />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
