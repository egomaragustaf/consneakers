import { prisma } from "~/db.server";

export type { Cart, CartItem, Product } from "@prisma/client";

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