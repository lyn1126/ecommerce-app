import { NextResponse } from "next/server";

import { deleteProduct } from "@/actions/products";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Delete failed" },
      { status: 400 },
    );
  }
}
