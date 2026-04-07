import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    take: 20,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: `${product.name} | Cửa hàng thời trang nữ`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.category.name}</Badge>
            {product.stock === 0 ? <Badge variant="destructive">Hết hàng</Badge> : null}
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold md:text-5xl">{product.name}</h1>
        </div>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline" }))}>
          Quay lại cửa hàng
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border-border/60 bg-card/80 py-0">
          <div className="relative aspect-[4/5] bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Chưa có ảnh sản phẩm
              </div>
            )}
          </div>
        </Card>

        <Card className="border-border/60 bg-card/85">
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm leading-7 text-muted-foreground">{product.description}</p>
              <div className="flex flex-wrap items-end gap-4">
                <p className="text-3xl font-semibold">{Number(product.price).toLocaleString("vi-VN")} VND</p>
                {product.originalPrice ? (
                  <p className="pb-1 text-base font-medium text-muted-foreground/70 line-through">
                    {Number(product.originalPrice).toLocaleString("vi-VN")} VND
                  </p>
                ) : null}
              </div>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Tình trạng</p>
                <p className="mt-2 text-lg font-medium">
                  {product.stock > 0 ? "Sẵn sàng giao ngay" : "Tạm hết hàng"}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Số lượng</p>
                <p className="mt-2 text-lg font-medium">
                  {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Không còn tồn kho"}
                </p>
              </div>
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                image: product.images[0],
                stock: product.stock,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
