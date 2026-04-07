import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { sendOrderConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function parseCartMetadata(cartRaw: string | null | undefined) {
  if (!cartRaw) return [];

  return cartRaw
    .split(",")
    .map((chunk) => {
      const [productId, quantityRaw] = chunk.split(":");
      const quantity = Number(quantityRaw);
      return {
        productId: productId?.trim(),
        quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0,
      };
    })
    .filter((item) => item.productId && item.quantity > 0) as Array<{
    productId: string;
    quantity: number;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Webhook is not configured" }, { status: 400 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const existedOrder = await prisma.order.findUnique({
        where: { stripeId: session.id },
      });
      if (existedOrder) {
        return NextResponse.json({ received: true, deduplicated: true });
      }

      const cartItems = parseCartMetadata(session.metadata?.cart);
      if (cartItems.length === 0) {
        return NextResponse.json({ error: "Missing cart metadata" }, { status: 400 });
      }

      const productIds = cartItems.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
      const productMap = new Map(products.map((product) => [product.id, product]));

      let total = 0;
      for (const item of cartItems) {
        const product = productMap.get(item.productId);
        if (!product) {
          return NextResponse.json(
            { error: `Product not found for webhook: ${item.productId}` },
            { status: 400 },
          );
        }
        total += Number(product.price) * item.quantity;
      }

      const orderNumber = `ORD-${Date.now()}`;
      const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            email: session.customer_email ?? "unknown@example.com",
            status: OrderStatus.PAID,
            total,
            stripeId: session.id,
            items: {
              create: cartItems.map((item) => {
                const product = productMap.get(item.productId)!;
                return {
                  productId: product.id,
                  quantity: item.quantity,
                  price: product.price,
                };
              }),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        await Promise.all(
          cartItems.map((item) => {
            const product = productMap.get(item.productId)!;
            return tx.product.update({
              where: { id: product.id },
              data: {
                stock: Math.max(product.stock - item.quantity, 0),
              },
            });
          }),
        );

        return createdOrder;
      });

      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        email: order.email,
        total: Number(order.total),
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook failed" },
      { status: 400 },
    );
  }
}
