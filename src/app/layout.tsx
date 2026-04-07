import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { SiteHeader } from "@/components/site/site-header";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maison Nha | Fashion E-commerce",
  description: "Cửa hàng thời trang nữ với trải nghiệm mua sắm và quản trị đồng bộ trên Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <div className="min-h-screen">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
