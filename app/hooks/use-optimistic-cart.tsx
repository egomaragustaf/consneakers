import { useMemo } from "react";
import { useFetchers } from "react-router";

import type { Cart, CartItem, Product } from "@prisma-generated/client";

export type CartWithItems =
  | (Cart & {
      cartItems: (CartItem & { product: Product | null })[];
    })
  | null;

const CART_ACTIONS = [
  "increment-item-in-cart",
  "decrement-item-in-cart",
  "delete-item-in-cart",
];

// Optimistic cart totals: committed values plus deltas from in-flight cart
// fetchers. The submitted hidden "quantity" field is the item's new target
// quantity, so each fetcher contributes target - committed for its item.
export function useOptimisticCart(cart: CartWithItems) {
  const fetchers = useFetchers();

  return useMemo(() => {
    if (!cart) {
      return { totalQuantity: 0, grandTotalPrice: 0 };
    }

    const targetQuantities = new Map<string, number>();
    for (const fetcher of fetchers) {
      const formData = fetcher.formData;
      if (!formData) continue;

      const action = String(formData.get("_action") ?? "");
      if (!CART_ACTIONS.includes(action)) continue;

      const cartItemId = String(formData.get("cartItemId") ?? "");
      if (!cartItemId) continue;

      if (action === "delete-item-in-cart") {
        targetQuantities.set(cartItemId, 0);
        continue;
      }

      const quantity = Number(formData.get("quantity"));
      if (Number.isFinite(quantity)) {
        targetQuantities.set(cartItemId, quantity);
      }
    }

    if (targetQuantities.size === 0) {
      return {
        totalQuantity: cart.totalQuantity,
        grandTotalPrice: cart.grandTotalPrice,
      };
    }

    let totalQuantity = cart.totalQuantity;
    let grandTotalPrice = cart.grandTotalPrice;
    for (const item of cart.cartItems) {
      const target = targetQuantities.get(item.id);
      if (target === undefined) continue;

      const delta = target - item.quantity;
      totalQuantity += delta;
      grandTotalPrice += delta * (item.product?.price ?? 0);
    }

    return { totalQuantity, grandTotalPrice };
  }, [cart, fetchers]);
}
