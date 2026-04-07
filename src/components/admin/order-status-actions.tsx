"use client";

import { OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateOrderStatus } from "@/actions/orders";
import { Button } from "@/components/ui/button";

type OrderStatusActionsProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [],
  CANCELLED: [],
};

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const nextStatuses = transitions[currentStatus];

  async function onChangeStatus(nextStatus: OrderStatus) {
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (!result.ok) {
        window.alert(result.error ?? "Cập nhật thất bại");
        return;
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  if (nextStatuses.length === 0) {
    return <span className="text-sm text-muted-foreground">Không còn trạng thái kế tiếp</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.map((status) => (
        <Button
          key={status}
          type="button"
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => onChangeStatus(status)}
        >
          {status}
        </Button>
      ))}
    </div>
  );
}
