"use client";

import { useActionState } from "react";
import {
  confirmOrder,
  rejectOrder,
  type OrderActionResult,
} from "@/features/admin/orders/actions/order";
import { Button } from "@/components/ui/Button";

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
          className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <form action={confirmAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button
            type="submit"
            variant="solid"
            disabled={pending}
            className="bg-green-700 hover:bg-green-800"
          >
            {confirmPending ? "Memproses..." : "Confirm Order"}
          </Button>
        </form>
        <form action={rejectAction}>
          <input type="hidden" name="orderId" value={orderId} />
          <Button
            type="submit"
            variant="outline"
            disabled={pending}
            className="border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
          >
            {rejectPending ? "Memproses..." : "Reject Order"}
          </Button>
        </form>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Menolak order akan mengembalikan stok yang sempat dipotong saat request
        dibuat.
      </p>
    </div>
  );
}
