import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Sidebar,
  Layout,
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  Separator,
} from "~/components";
import { useRootLoaderData } from "~/hooks";
import { formatValueToCurrency } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Admin Dahsboard" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!userSession?.id) return redirect("/logout");

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
  });
  if (!user) return redirect("/logout");

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  return json({ user, cartItems: cart?.cartItems });
};

export default function Route() {
  const { user, cartItems } = useLoaderData<typeof loader>();
  const { cart } = useRootLoaderData();
  const isAdmin = user?.username === "admin";

  if (!user || !isAdmin) {
    return (
      <Layout>
        <main className="flex gap-8 justify-start items-start min-h-screen">
          <p>Sorry something went wrong</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex gap-8 justify-start items-start min-h-screen">
        <div className="lg:w-60 flex">
          <Sidebar />
        </div>

        <div className="flex flex-col gap-4">
          <header className="space-y-2">
            <h1 className="text-2xl">Welcome, {user.username}!</h1>
            <p>This is your Cart Summary Section</p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-zinc-300 hover:bg-zinc-50 rounded-xl w-64 p-4">
              <CardHeader className="flex items-center justify-start">
                <h1>Cart Items Quantity</h1>
              </CardHeader>
              <CardContent>
                {cart && cart?.totalQuantity > 0 ? (
                  <CardDescription className="text-2xl font-bold text-start">
                    {cart?.totalQuantity}
                  </CardDescription>
                ) : (
                  <CardDescription className="text-sm font-semibold text-start">
                    You don't have any products yet!{" "}
                    <Link
                      to={"/products"}
                      className="text-primary text-sm font-semibold">
                      Add Products
                    </Link>
                  </CardDescription>
                )}
              </CardContent>
            </Card>
            <Card className="border border-zinc-300 hover:bg-zinc-50 rounded-xl w-64 p-4">
              <CardHeader className="flex items-center justify-start">
                <h1>Cart Total Price</h1>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold text-start">
                  {formatValueToCurrency(cart?.grandTotalPrice)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <h2>Your Cart</h2>
          {cartItems?.map((cartItem) => {
            return (
              <div className="flex flex-col" key={cartItem?.id}>
                <div className="flex">
                  <Link to={`/products/${cartItem?.product?.slug}`}>
                    <img
                      className="w-20 rounded border-slate-200 shadow-md"
                      src={cartItem?.product?.imageURL || ""}
                      alt={cartItem?.product?.name}
                    />
                  </Link>

                  <Separator orientation="vertical" className="mx-2" />

                  <div className="flex flex-col items-start justify-center">
                    <Link to={`/products/${cartItem?.product?.slug}`}>
                      <h3 className="font-medium">{cartItem?.product.name}</h3>
                    </Link>
                    <p>
                      <span>{cartItem?.quantity}</span> x{" "}
                      {formatValueToCurrency(cartItem.product.price)}
                    </p>
                    <h2 className="text-base font-medium">
                      {formatValueToCurrency(cartItem.totalPrice)}
                    </h2>
                  </div>
                </div>

                <Separator className="my-2" />
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
