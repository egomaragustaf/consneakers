import type { V2_MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { authenticator } from "~/services";
import {
  Button,
  Layout,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Cart" }, { name: "description", content: "Cart" }];
};

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageURL: string | null;
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Cart {
  cartItems: CartItem[];
  totalPrice: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const existingCart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: { include: { product: true } } },
  });

  if (!existingCart) {
    const newCart = await prisma.cart.create({
      data: { userId: userSession.id || "" },
      include: { cartItems: { include: { product: true } } },
    });
    return json({ cart: newCart });
  }

  const cartItemsMap = new Map<string, CartItem>();
  for (const cartItem of existingCart.cartItems) {
    if (cartItemsMap.has(cartItem.product.id)) {
      cartItemsMap.get(cartItem.product.id)!.quantity += cartItem.quantity;
    } else {
      cartItemsMap.set(cartItem.product.id, { ...cartItem });
    }
  }

  const aggregatedCartItems = Array.from(cartItemsMap.values());

  const totalPrice = aggregatedCartItems.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
    0
  );

  return json({ cart: { cartItems: aggregatedCartItems, totalPrice } });
};

export default function Route() {
  const { cart } = useLoaderData<{ cart: Cart }>();

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-4 w-1/2 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>My Cart</h1>
            </header>

            {cart.cartItems.map((cartItem) => (
              <div key={cartItem.id} className="flex flex-col">
                <div className="flex">
                  <img
                    src={cartItem.product.imageURL || ""}
                    alt={cartItem.product.name}
                    className="w-24 rounded border-primary"
                  />
                  <Separator orientation="vertical" className="mx-2" />

                  <div className="flex flex-col items-start justify-center">
                    <h2>{cartItem.product.name}</h2>
                    <p>Rp {cartItem.product.price.toLocaleString("id-ID")}</p>
                    <h3 className="text-xl font-semibold text-primary">
                      Rp{" "}
                      {(
                        cartItem.product.price * cartItem.quantity
                      ).toLocaleString("id-ID")}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Available Stock:</span>
                  <div className="flex gap-4 items-center">
                    <Button variant={"outline"}>
                      <AiOutlineMinus className="text-sm" />
                    </Button>
                    <span>{cartItem.quantity}</span>
                    <Button variant={"outline"}>
                      <AiOutlinePlus className="text-sm" />
                    </Button>
                    <Button variant={"destructive"}>
                      <MdOutlineDelete className="text-sm"></MdOutlineDelete>
                    </Button>
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
                  <TableCell>
                    {cart.cartItems.reduce(
                      (total, cartItem) => total + cartItem.quantity,
                      0
                    )}
                  </TableCell>
                  <TableCell>0%</TableCell>
                  <TableCell className="text-lg font-semibold text-primary">
                    Rp {cart.totalPrice.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Button>CHECKOUT</Button>
          </section>
        </article>
      </main>
    </Layout>
  );
}
