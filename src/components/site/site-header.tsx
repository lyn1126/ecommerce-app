import Link from "next/link";

import { CartBadge } from "@/components/store/cart-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  adminHref?: string;
};

export function SiteHeader({ adminHref = "/admin/products" }: SiteHeaderProps) {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex flex-col">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-muted-foreground">
              LYN Fashion
            </span>
            <span className="text-lg font-semibold tracking-[0.12em]">Womenswear Store</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-foreground")}
            >
              Sản phẩm
            </Link>
            <Link
              href={adminHref}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-foreground")}
            >
              Quản trị
            </Link>
          </nav>
        </div>

        <CartBadge />
      </div>
    </header>
  );
}
