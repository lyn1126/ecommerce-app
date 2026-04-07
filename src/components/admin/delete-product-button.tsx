"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteProductButtonProps = {
  id: string;
};

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        window.alert(payload.error ?? "Không thể xóa sản phẩm này.");
        return;
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Trash2Icon data-icon="inline-start" />
            Xóa
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa khỏi trang bán hàng và khu vực quản trị.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onDelete}>
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
