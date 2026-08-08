import { prisma } from "~/db.server";

export type { Cart, CartItem, Product } from "@prisma-generated/client";

export async function getShoppingCart(userId: string) {
    return prisma.cart.findFirst({
      where: { id: userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

// Derived totals: the stored totalQuantity/grandTotalPrice columns on Cart are
// only a cache and can drift, so all display paths compute from cartItems.
// product is treated as nullable because relationMode "prisma" does not
// enforce foreign keys, so orphaned cartItems (deleted products) are possible.
export function computeCartTotals(
  cartItems: { quantity: number; product: { price: number } | null }[]
) {
  return cartItems.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + item.quantity,
      grandTotalPrice:
        acc.grandTotalPrice + (item.product?.price ?? 0) * item.quantity,
    }),
    { totalQuantity: 0, grandTotalPrice: 0 }
  );
}