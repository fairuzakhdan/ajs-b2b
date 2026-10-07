"use client";

import { useActionState } from "react";
import { submitOrderRequest, type SubmitOrderResult } from "@/app/actions/order";

const initialState: SubmitOrderResult = {};

export function SubmitOrderButton() {
  const [state, formAction, isPending] = useActionState(
    submitOrderRequest,
    initialState
  );

  return (
    <form action={formAction}>
      {state.error && (
        <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-800 text-white font-semibold px-6 py-3 hover:bg-blue-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Mengirim..." : "Submit Request Order"}
      </button>
    </form>
  );
}
