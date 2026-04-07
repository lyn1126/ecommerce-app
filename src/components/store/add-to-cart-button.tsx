"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ensureCartHydrated, useCartStore } from "@/store/cart-store";

type AddToCartButtonProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image?: string;
    stock: number;
  };
  iconOnly?: boolean;
};

export function AddToCartButton({ product, iconOnly = false }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const [justAdded, setJustAdded] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void ensureCartHydrated().finally(() => {
      if (isMounted) {
        setIsPreparing(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!justAdded) return;
    const timeout = window.setTimeout(() => setJustAdded(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [justAdded]);

  async function handleAddToCart() {
    if (!hasHydrated) {
      setIsPreparing(true);
      await ensureCartHydrated();
      setIsPreparing(false);
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      stock: product.stock,
    });
    setJustAdded(true);
  }

  const isDisabled = product.stock <= 0 || isPreparing;

  if (iconOnly) {
    return (
      <Button
        type="button"
        size="icon"
        variant={product.stock > 0 ? "default" : "outline"}
        className="rounded-full"
        disabled={isDisabled}
        onClick={() => void handleAddToCart()}
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
      disabled={isDisabled}
      onClick={() => void handleAddToCart()}
    >
      {product.stock > 0
        ? isPreparing
          ? "Đang tải giỏ hàng..."
          : justAdded
            ? "Đã thêm vào giỏ"
            : "Thêm vào giỏ"
        : "Hết hàng"}
    </Button>
  );
}
