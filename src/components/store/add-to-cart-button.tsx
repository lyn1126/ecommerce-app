"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
  };
  iconOnly?: boolean;
};

export function AddToCartButton({ product, iconOnly = false }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timeout = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [justAdded]);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setJustAdded(true);
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        size="icon"
        variant={product.stock > 0 ? "default" : "outline"}
        className="rounded-full"
        disabled={product.stock <= 0}
        onClick={handleAddToCart}
        aria-label={product.stock > 0 ? "Mua ngay" : "Hết hàng"}
        title={product.stock > 0 ? "Mua ngay" : "Hết hàng"}
      >
        <ShoppingBagIcon className={cn(justAdded ? "scale-110" : "scale-100", "transition-transform")} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="lg"
      variant={product.stock > 0 ? "default" : "outline"}
      className="w-full"
      disabled={product.stock <= 0}
      onClick={handleAddToCart}
    >
      {product.stock > 0 ? (justAdded ? "Đã thêm vào giỏ" : "Thêm vào giỏ") : "Hết hàng"}
    </Button>
  );
}
