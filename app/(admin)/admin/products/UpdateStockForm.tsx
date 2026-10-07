"use client";

import { useActionState } from "react";
import { updateStock, type UpdateStockResult } from "@/app/actions/product";

const initialState: UpdateStockResult = {};

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Reserved", value: "RESERVED" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

export function UpdateStockForm({
  productId,
  availableQty,
  moq,
  stockStatus,
}: {
  productId: string;
  availableQty: number;
  moq: number;
  stockStatus: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateStock,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Available (KG)
          </label>
          <input
            type="number"
            name="availableQty"
            defaultValue={availableQty}
            min={0}
            step="any"
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            MOQ (KG)
          </label>
          <input
            type="number"
            name="moq"
            defaultValue={moq}
            min={0}
            step="any"
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Status Stock
        </label>
        <select
          name="stockStatus"
          defaultValue={stockStatus}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1.5">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-1.5">
          Perubahan tersimpan.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-800 text-white font-semibold px-4 py-2 text-sm hover:bg-blue-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
