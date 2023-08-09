import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { authenticator } from "~/services";
import { Button, Layout, Separator } from "~/components";

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
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start mt-32 md:mt-40">
        <article className="flex gap-8 w-full max-w-4xl">
          <div className="flex flex-col flex-grow gap-4 w-1/3">
            <header className="text-2xl font-bold">
              <section className="flex flex-col gap-2"></section>
            </header>

            <section className="flex flex-col gap-4">
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

                    <div>
                      <Button variant={"outline"}>
                        <AiOutlineMinus className="text-lg" />
                      </Button>
                      <span>{cartItem.quantity}</span>
                      <Button variant={"outline"}>
                        <AiOutlinePlus className="text-lg" />
                      </Button>
                      <Button variant={"destructive"}>
                        <MdOutlineDelete className="text-lg"></MdOutlineDelete>
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}

              <div>Rp {cart.totalPrice.toLocaleString("id-ID")}</div>

              <Button>CHECKOUT</Button>
            </section>
          </div>
        </article>
      </main>
    </Layout>
  );
}
