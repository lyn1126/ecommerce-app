import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center px-4 py-10">
      <Card className="w-full border-border/60 bg-card/85">
        <CardHeader className="items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2Icon className="size-7" />
          </div>
          <Badge variant="outline">Thanh toán thành công</Badge>
          <CardTitle className="text-3xl">Đơn hàng đã được ghi nhận</CardTitle>
          <CardDescription className="max-w-xl">
            Cảm ơn bạn đã mua sắm. Chúng tôi sẽ gửi email xác nhận và cập nhật trạng thái đơn hàng sớm nhất.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm leading-7 text-muted-foreground">
          Bạn có thể quay lại cửa hàng để tiếp tục chọn thêm sản phẩm hoặc vào trang theo dõi đơn hàng khi đã
          có mã đơn.
        </CardContent>
        <CardFooter className="justify-center gap-3">
          <Link href="/products" className={cn(buttonVariants({}))}>
            Tiếp tục mua sắm
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Về trang chủ
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
