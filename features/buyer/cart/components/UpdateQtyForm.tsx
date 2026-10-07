"use client";

import { useActionState } from "react";
import { updateCartItemQty, type CartActionResult } from "@/features/buyer/cart/actions/cart";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: CartActionResult = {};

export function UpdateQtyForm({
  cartItemId,
  initialQty,
  moq,
  availableQty,
}: {
  cartItemId: string;
  initialQty: number;
  moq: number;
  availableQty: number;
}) {
  const [state, formAction, isPending] = useActionState(
    updateCartItemQty,
    initialState
  );

  return (
    <form action={formAction} className="flex items-start gap-2">
      <input type="hidden" name="cartItemId" value={cartItemId} />
      <Input
        type="number"
        name="quantity"
        defaultValue={initialQty}
        min={moq}
        max={availableQty}
        step="any"
        className="w-24"
        error={state.error}
      />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isPending}
      >
        {isPending ? "..." : "Update"}
      </Button>
    </form>
  );
}
