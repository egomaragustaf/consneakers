import type {
  ActionArgs,
  V2_MetaFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import {
  Button,
  Input,
  Layout,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import type { getShoppingCart } from "~/models/cart.server";

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
      data: { userId: userSession?.id },
      include: { cartItems: { include: { product: true } } },
    });
    return json({ cart: newCart });
  }

  return json({ cart: existingCart });
};

export default function Route() {
  const { cart } = useLoaderData<LoaderData>();
  const totalItemCount =
    cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const grandTotal =
    cart?.cartItems.reduce((acc, item) => acc + item.totalPrice, 0) ?? 0;

  if (cart?.cartItems.length == 0) {
    return (
      <Layout>
        <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
          <article className="flex gap-16 w-full max-w-5xl min-h-screen">
            <section className="flex flex-col gap-4 w-1/2 max-w-3xl">
              <header className="text-2xl font-bold">
                <h1>My Cart</h1>
              </header>
              <p>
                No items in the shopping cart. Please,{" "}
                <Link to={`/`}>
                  <span className="text-primary font-bold">add product!</span>
                </Link>
              </p>
            </section>
          </article>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex lg:flex-col flex-row gap-4 w-1/2 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>My Cart</h1>
            </header>
            {cart?.cartItems.map((cartItem) => (
              <div key={cartItem.id} className="flex flex-col">
                <div className="flex">
                  <Link to={`/products/${cartItem.product.slug}`}>
                    <img
                      src={cartItem.product.imageURL!}
                      alt={cartItem.product.name}
                      className="w-28 rounded border-slate-200 shadow-md"
                    />
                  </Link>
                  <Separator orientation="vertical" className="mx-2" />

                  <div className="flex flex-col items-start justify-center">
                    <h2>{cartItem.product.name}</h2>
                    <p>Rp {cartItem.product.price}</p>
                    <h3 className="text-xl font-semibold text-primary">
                      Rp {cartItem.totalPrice}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Available Stock:</span>
                  <div className="flex gap-4 items-center">
                    <Button variant={"outline"}>
                      <AiOutlineMinus className="text-sm" />
                    </Button>

                    <Input
                      disabled
                      className="text-center w-10 bg-slate-100 disabled:cursor-default"
                      value={cartItem.quantity}
                    />

                    <Button variant={"outline"}>
                      <AiOutlinePlus className="text-sm" />
                    </Button>

                    <Form method="POST">
                      <input
                        type="hidden"
                        name="cartItemId"
                        defaultValue={cartItem.id}
                      />
                      <Button variant="destructive" type="submit">
                        <MdOutlineDelete className="text-sm"></MdOutlineDelete>
                      </Button>
                    </Form>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-4 w-1/2 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>Cart Subtotal</h1>
            </header>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Total Product:</TableHead>
                  <TableHead>Total Discount:</TableHead>
                  <TableHead>Total Price:</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{totalItemCount}</TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell className="text-lg font-semibold text-primary">
                    Rp {grandTotal}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Button>CHECKOUT</Button>
            {/* <pre>{JSON.stringify(cart, null, 2)}</pre> */}
          </section>
        </article>
      </main>
    </Layout>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const cartItemId = formData.get("cartItemId")?.toString();

  if (cartItemId) {
    try {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      return json({ success: "Remove product from cart" });
    } catch (error) {
      return json(
        { error: "Failed to remove product from cart" },
        { status: 400 }
      );
    }
  }

  return json({ error: "Invalid request" }, { status: 400 });
};
