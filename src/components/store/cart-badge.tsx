"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartBadge() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Link
      href="/cart"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 rounded-full px-3")}
    >
      Giỏ hàng
      <Badge variant="secondary">{totalItems}</Badge>
    </Link>
  );
}
