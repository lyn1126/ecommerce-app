"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ensureCartHydrated, useCartStore } from "@/store/cart-store";

export function CartClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    void ensureCartHydrated();
  }, []);

  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  async function onCheckout() {
    if (!email || items.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as { url?: string };

      if (data.url) {
        clearCart();
        router.push(data.url);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasHydrated) {
    return (
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Đang tải giỏ hàng</CardTitle>
          <CardDescription>Dữ liệu trong giỏ đang được đồng bộ từ trình duyệt.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Giỏ hàng đang trống</CardTitle>
          <CardDescription>Thêm vài thiết kế mới để bắt đầu đơn hàng của bạn.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/products" className={cn(buttonVariants({ size: "sm" }))}>
            Khám phá sản phẩm
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Card key={item.productId} className="border-border/60 bg-card/80">
            <CardContent className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{item.slug}</p>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-muted-foreground">{item.price.toLocaleString("vi-VN")} VND</p>
                  {item.originalPrice ? (
                    <p className="text-xs text-muted-foreground/70 line-through">
                      {item.originalPrice.toLocaleString("vi-VN")} VND
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  className="w-20"
                  onChange={(event) => updateQty(item.productId, Number(event.target.value))}
                />
                <Button type="button" variant="outline" onClick={() => removeItem(item.productId)}>
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit border-border/60 bg-card/90">
        <CardHeader>
          <CardTitle>Tóm tắt đơn hàng</CardTitle>
          <CardDescription>Hoàn tất thông tin để chuyển sang Stripe Checkout.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="font-medium">{total.toLocaleString("vi-VN")} VND</span>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <label htmlFor="checkout-email" className="text-sm font-medium">
              Email nhận đơn
            </label>
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Button type="button" disabled={isLoading} onClick={onCheckout}>
            {isLoading ? "Đang tạo checkout..." : "Thanh toán với Stripe"}
          </Button>
          <p className="text-xs leading-6 text-muted-foreground">
            Sau khi thanh toán thành công, bạn sẽ nhận email xác nhận và có thể theo dõi trạng thái đơn hàng.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
