import Link from "next/link";

import { getOrders } from "@/actions/orders";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline">Order control</Badge>
          <h1 className="text-4xl font-semibold">Quản lý đơn hàng</h1>
          <p className="text-base text-muted-foreground">
            Theo dõi trạng thái thanh toán và cập nhật tiến trình xử lý cho từng đơn.
          </p>
        </div>
        <Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }))}>
          Quay lại sản phẩm
        </Link>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>{orders.length} đơn hàng được ghi nhận trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{order.orderNumber}</span>
                      <Link href={`/orders/${order.orderNumber}`} className="text-sm text-muted-foreground underline">
                        Xem trang theo dõi
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{Number(order.total).toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell>
                    <Badge>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <OrderStatusActions orderId={order.id} currentStatus={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
