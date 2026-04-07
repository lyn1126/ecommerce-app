import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is missing" }, { status: 500 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { items, email } = parsed.data;
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });

    const cartMeta = items.map((item) => `${item.productId}:${item.quantity}`).join(",");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      metadata: {
        cart: cartMeta,
      },
      line_items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        return {
          quantity: item.quantity,
          price_data: {
            currency: "vnd",
            product_data: { name: product.name },
            unit_amount: Math.round(Number(product.price)),
          },
        };
      }),
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 },
    );
  }
}
