import { removeFromCart } from "@/app/actions/cart";

export function RemoveButton({ cartItemId }: { cartItemId: string }) {
  return (
    <form action={removeFromCart}>
      <input type="hidden" name="cartItemId" value={cartItemId} />
      <button
        type="submit"
        className="text-sm font-medium text-red-700 hover:text-red-900 transition-colors"
      >
        Remove
      </button>
    </form>
  );
}
