"use client";

import { useActionState } from "react";
import { updateStock, type UpdateStockResult } from "@/features/admin/products/actions/product";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
        <Input
          type="number"
          name="availableQty"
          label="Available (KG)"
          defaultValue={availableQty}
          min={0}
          step="any"
        />
        <Input
          type="number"
          name="moq"
          label="MOQ (KG)"
          defaultValue={moq}
          min={0}
          step="any"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status Stock
        </label>
        <select
          name="stockStatus"
          defaultValue={stockStatus}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition-colors focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-sky-400/40"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md border border-green-200 bg-green-50 px-2 py-1.5 text-xs text-green-700">
          Perubahan tersimpan.
        </p>
      )}

      <Button
        type="submit"
        variant="solid"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
