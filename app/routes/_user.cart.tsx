import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";

interface Product {
  id: string;
  name: string;
  price: number;
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
              {cart.cartItems.map((cartItem) => (
                <ul key={cartItem.id}>
                  <li>Product name: {cartItem.product.name}</li>
                  <li>Quantity: {cartItem.quantity}</li>
                  <li>Price: {cartItem.product.price * cartItem.quantity}</li>
                  <li>Total price: {cart.totalPrice}</li>
                </ul>
              ))}
            </section>
          </div>
        </article>
      </main>
    </Layout>
  );
}
