"use client";

import { useActionState } from "react";
import { updateCartItemQty, type CartActionResult } from "@/app/actions/cart";

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
      <div>
        <input
          type="number"
          name="quantity"
          defaultValue={initialQty}
          min={moq}
          max={availableQty}
          step="any"
          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        />
        {state.error && (
          <p className="mt-1 text-xs text-red-700 max-w-xs">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
      >
        {isPending ? "..." : "Update"}
      </button>
    </form>
  );
}
