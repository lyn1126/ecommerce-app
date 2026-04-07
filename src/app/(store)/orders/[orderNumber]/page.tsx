import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrderByNumber } from "@/actions/orders";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline">Order tracking</Badge>
          <h1 className="text-4xl font-semibold">Theo dõi đơn hàng</h1>
          <p className="text-base text-muted-foreground">Mã đơn: {order.orderNumber}</p>
        </div>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline" }))}>
          Tiếp tục mua sắm
        </Link>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Thông tin đơn hàng</CardTitle>
          <CardDescription>Email đặt hàng: {order.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge>{order.status}</Badge>
          <span className="text-sm text-muted-foreground">
            Tổng thanh toán: {Number(order.total).toLocaleString("vi-VN")} VND
          </span>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {order.items.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4">
              {index > 0 ? <Separator /> : null}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                </div>
                <p className="font-medium">{Number(item.price).toLocaleString("vi-VN")} VND</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
