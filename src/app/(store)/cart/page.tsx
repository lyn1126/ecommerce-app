import { CartClient } from "@/components/store/cart-client";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit">
          Checkout
        </Badge>
        <h1 className="text-4xl font-semibold">Giỏ hàng</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Kiểm tra lại số lượng, email nhận đơn và chuyển sang Stripe Checkout để hoàn tất thanh toán.
        </p>
      </div>

      <CartClient />
    </main>
  );
}
