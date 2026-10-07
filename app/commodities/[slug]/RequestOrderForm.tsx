"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToCart, type CartActionResult } from "@/app/actions/cart";

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
      <div>
        <label
          htmlFor="quantity"
          className="block text-xs font-medium text-slate-500 mb-1"
        >
          Quantity (KG) — min {moq}, maks {availableQty}
        </label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          defaultValue={moq}
          min={moq}
          max={availableQty}
          step="any"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center rounded-md bg-blue-800 text-white font-semibold px-6 py-3 hover:bg-blue-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Menambahkan..." : "Request Order"}
      </button>
    </form>
  );
}
