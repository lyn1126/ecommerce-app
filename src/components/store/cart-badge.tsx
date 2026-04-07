"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ensureCartHydrated, useCartStore } from "@/store/cart-store";

export function CartBadge() {
  useEffect(() => {
    void ensureCartHydrated();
  }, []);

  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Link
      href="/cart"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 rounded-full px-3")}
    >
      {"Gi\u1ecf h\u00e0ng"}
      <Badge variant="secondary">{hasHydrated ? totalItems : 0}</Badge>
    </Link>
  );
}
