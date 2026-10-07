"use client";

import { useActionState } from "react";
import { submitOrderRequest, type SubmitOrderResult } from "@/features/buyer/cart/actions/order";
import { Button } from "@/components/ui/Button";

const initialState: SubmitOrderResult = {};

export function SubmitOrderButton() {
  const [state, formAction, isPending] = useActionState(
    submitOrderRequest,
    initialState
  );

  return (
    <form action={formAction}>
      {state.error && (
        <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <Button
        type="submit"
        variant="solid"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Mengirim..." : "Submit Request Order"}
      </Button>
    </form>
  );
}
