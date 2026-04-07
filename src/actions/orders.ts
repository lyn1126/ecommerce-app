"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

export async function updateOrderStatus(orderId: string, nextStatus: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, orderNumber: true },
  });

  if (!order) {
    return { ok: false, error: "Order not found" };
  }

  const allowed = orderTransitions[order.status].includes(nextStatus);
  if (!allowed) {
    return { ok: false, error: `Cannot update from ${order.status} to ${nextStatus}` };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${order.orderNumber}`);
  return { ok: true };
}
