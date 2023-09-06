import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Layout, Table, TableBody, TableCell, TableRow } from "~/components";
import { prisma } from "~/db.server";
import type { getShoppingCart } from "~/models/cart.server";
import { authenticator } from "~/services";
import { formatValueToCurrency } from "~/utils";

type LoaderData = {
  cart: Awaited<ReturnType<typeof getShoppingCart>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!userSession.id) return null;

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  return json({ cart });
};

export default function Route() {
  const { cart } = useLoaderData<LoaderData>();
  const totalItemCount =
    cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const grandTotal =
    cart?.cartItems.reduce((acc, item) => acc + item.totalPrice, 0) ?? 0;

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex lg:flex-row flex-col gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-4 lg:w-2/3 max-w-3xl"></section>

          <section className="flex flex-col gap-4 lg:w-1/3 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>Summary</h1>
            </header>

            <Table className="bg-zinc-100 rounded">
              <TableBody>
                <TableRow>
                  <TableCell>Total Product:</TableCell>
                  <TableCell>{totalItemCount}</TableCell>
                </TableRow>
                <TableRow className="text-lg font-bold text-zinc-800">
                  <TableCell>Total Price:</TableCell>
                  <TableCell>{formatValueToCurrency(grandTotal)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </article>
      </main>
    </Layout>
  );
}
