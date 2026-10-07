"use client";

import { useActionState } from "react";
import {
  confirmOrder,
  rejectOrder,
  type OrderActionResult,
} from "@/app/actions/order";

const initialState: OrderActionResult = {};

export function OrderActionButtons({ orderId }: { orderId: string }) {
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmOrder,
    initialState
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    rejectOrder,
    initialState
  );

  const error = confirmState.error ?? rejectState.error;
  const pending = confirmPending || rejectPending;

  return (
    <div>
      {error && (
        <p
          role="alert"
          className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <form action={confirmAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-green-700 text-white font-semibold px-5 py-2.5 hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {confirmPending ? "Memproses..." : "Confirm Order"}
          </button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md border border-red-300 text-red-700 font-semibold px-5 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {rejectPending ? "Memproses..." : "Reject Order"}
          </button>
        </form>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Menolak order akan mengembalikan stok yang sempat dipotong saat request
        dibuat.
      </p>
    </div>
  );
}
