import { removeFromCart } from "@/features/buyer/cart/actions/cart";
import { Button } from "@/components/ui/Button";

export function RemoveButton({ cartItemId }: { cartItemId: string }) {
  return (
    <form action={removeFromCart}>
      <input type="hidden" name="cartItemId" value={cartItemId} />
      <Button type="submit" variant="ghost" size="sm" className="text-red-700 hover:text-red-900">
        Remove
      </Button>
    </form>
  );
}
