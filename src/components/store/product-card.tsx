import Image from "next/image";
import Link from "next/link";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    featured?: boolean;
    category: {
      name: string;
    };
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full border-border/60 bg-card/80 py-0 shadow-sm shadow-black/5">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={900}
              height={1125}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Chưa có ảnh
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{product.category.name}</Badge>
          {product.featured ? <Badge>Sản phẩm nổi bật</Badge> : null}
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">
            <Link href={`/products/${product.slug}`} className="transition-colors hover:text-primary/80">
              {product.name}
            </Link>
          </CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between gap-4 pb-5">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{product.price.toLocaleString("vi-VN")} VND</p>
          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
          </p>
        </div>

        <AddToCartButton
          iconOnly
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0],
            stock: product.stock,
          }}
        />
      </CardContent>
    </Card>
  );
}
