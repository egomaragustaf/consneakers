import type {
  ActionArgs,
  V2_MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import {
  Button,
  CartItem,
  Layout,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "~/components";
import type { getShoppingCart } from "~/models/cart.server";
import { formatValueToCurrency } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Cart" }, { name: "description", content: "Cart" }];
};

type LoaderData = {
  cart: Awaited<ReturnType<typeof getShoppingCart>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!userSession.id) return null;

  const existingCart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  if (!existingCart) {
    const newCart = await prisma.cart.create({
      data: {
        userId: userSession?.id,
        totalQuantity: 0,
        grandTotalPrice: 0,
      },
      include: { cartItems: { include: { product: true } } },
    });
    return json({ cart: newCart });
  }

  const totalQuantity = existingCart.cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const grandTotalPrice = existingCart.cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Update the existing cart with the calculated values
  await prisma.cart.update({
    where: { id: existingCart.id },
    data: {
      totalQuantity,
      grandTotalPrice,
    },
  });

  return json({ cart: { ...existingCart, totalQuantity, grandTotalPrice } });
};

export default function Route() {
  const { cart } = useLoaderData<LoaderData>();

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex lg:flex-row flex-col gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-4 lg:w-2/3 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>My Cart</h1>
            </header>

            {!cart?.cartItems.length ? (
              <p>
                No items in the shopping cart. Please,{" "}
                <Link to={`/products`}>
                  <span className="text-primary font-bold">add a product!</span>
                </Link>
              </p>
            ) : (
              <>
                {cart?.cartItems.map((cartItem) => (
                  <CartItem
                    key={cartItem.id}
                    cart={cart}
                    cartItem={cartItem}
                    product={cartItem.product}
                    quantity={cartItem.quantity}
                  />
                ))}
              </>
            )}

            {!cart?.cartItems.length ? null : (
              <Link to={`/products`}>
                <span className="text-primary text-base w-full flex items-center justify-end font-bold">
                  Add products again
                </span>
              </Link>
            )}
          </section>

          {!cart?.cartItems.length ? null : (
            <section className="flex flex-col gap-4 lg:w-1/3 max-w-3xl">
              <header className="text-2xl font-bold">
                <h1>Summary</h1>
              </header>

              <Table className="bg-zinc-100 rounded">
                <TableBody>
                  <TableRow>
                    <TableCell>Total Product:</TableCell>
                    <TableCell>{cart.totalQuantity}</TableCell>
                  </TableRow>
                  <TableRow className="text-lg font-bold text-zinc-800">
                    <TableCell>Total Price:</TableCell>
                    <TableCell>
                      {formatValueToCurrency(cart.grandTotalPrice)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Link to={`/checkout`}>
                <Button className="w-full bg-zinc-800 hover:bg-zinc-700">
                  CHECKOUT
                </Button>
              </Link>
            </section>
          )}
        </article>
      </main>
    </Layout>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const cartItemId = formData.get("cartItemId")?.toString();
  const action = formData.get("_action");

  if (cartItemId && action) {
    try {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { product: true },
      });

      if (!cartItem) {
        return null;
      }

      switch (action) {
        case "increment-item-in-cart": {
          const newQuantity = cartItem.quantity + 1;
          const newTotalPrice = cartItem.product.price * newQuantity;
          return await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: {
              quantity: newQuantity,
              totalPrice: newTotalPrice,
            },
            include: { product: true },
          });
        }

        case "decrement-item-in-cart": {
          const newQuantity = cartItem.quantity - 1;
          const newTotalPrice = cartItem.product.price * newQuantity;
          if (cartItem.quantity > 1) {
            return await prisma.cartItem.update({
              where: { id: cartItem.id },
              data: {
                quantity: newQuantity,
                totalPrice: newTotalPrice,
              },
              include: { product: true },
            });
          }
          return await prisma.cartItem.delete({ where: { id: cartItem.id } });
        }

        case "delete-item-in-cart": {
          return await prisma.cartItem.delete({ where: { id: cartItem.id } });
        }

        default:
          return json({ message: "Invalid action" }, { status: 400 });
      }
    } catch (error) {
      return json({ error: "Error" }, { status: 500 });
    }
  }

  return json({ message: "Invalid request" }, { status: 400 });
};
