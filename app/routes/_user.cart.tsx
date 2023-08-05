import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";

import {
  Layout,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";

interface Product {
  id: string;
  name: string;
  price: number;
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
      data: { userId: userSession.id },
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
        <article className="flex gap-8 w-full max-w-4xl">
          <div className="flex flex-col flex-grow gap-4 w-1/3">
            <header className="text-2xl font-bold">
              <section className="flex flex-col gap-2"></section>
            </header>

            <section className="flex flex-col gap-2">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.cartItems.map((cartItem) => (
                    <TableRow key={cartItem.id}>
                      <TableCell className="font-medium">
                        <img
                          src={cartItem.product.imageURL || ""}
                          alt={cartItem.product.name}
                        />
                      </TableCell>
                      <TableCell>{cartItem.product.name}</TableCell>
                      <TableCell className="text-right">
                        {cartItem.product.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          </div>
        </article>
      </main>
    </Layout>
  );
}
