"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToCart, type CartActionResult } from "@/features/buyer/cart/actions/cart";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: CartActionResult = {};

export function RequestOrderForm({
  productId,
  moq,
  availableQty,
}: {
  productId: string;
  moq: number;
  availableQty: number;
}) {
  const [state, formAction, isPending] = useActionState(
    addToCart,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/cart");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <Input
        id="quantity"
        type="number"
        name="quantity"
        label={`Quantity (KG) — min ${moq}, maks ${availableQty}`}
        defaultValue={moq}
        min={moq}
        max={availableQty}
        step="any"
        required
        error={state.error}
      />

      <Button
        type="submit"
        variant="solid"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Menambahkan..." : "Request Order"}
      </Button>
    </form>
  );
}
