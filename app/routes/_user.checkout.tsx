import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { formatValueToCurrency } from "~/utils";

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
  totalPrice: number;
}

interface Cart {
  cartItems: CartItem[];
  totalPrice: number;
}

export const loader = async ({ request }: LoaderArgs) => {
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
  const { cart } = useLoaderData<{ cart: Cart }>();
  const totalItemCount =
    cart?.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  const grandTotal =
    cart?.cartItems.reduce((acc, item) => acc + item.totalPrice, 0) ?? 0;

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex lg:flex-row flex-col gap-16 w-full max-w-5xl min-h-screen">
          <section className="flex flex-col gap-4 lg:w-2/3 max-w-3xl">
            <header className="text-2xl font-bold">
              <h1>My Cart</h1>

              <h1>{formatValueToCurrency(grandTotal)}</h1>
              <p>{totalItemCount}</p>
            </header>
          </section>
        </article>
      </main>
    </Layout>
  );
}
