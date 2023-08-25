import { parse } from "@conform-to/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";
import { prisma } from "~/db.server";
import { Layout, ButtonLoading, Button } from "~/components";
import { useRootLoaderData } from "~/hooks";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Detail Product" },
    { name: "description", content: "Detail Product" },
  ];
};

export async function loader({ params }: LoaderArgs) {
  if (!params.slug) {
    return json({ product: null });
  }

  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return json({ product });
}

export default function Route() {
  const { userSession } = useRootLoaderData();
  const { product } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!product) {
    return (
      <Layout>
        <h1>404 product not found</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start min-h-screen">
        <article className="flex lg:flex-row flex-col gap-8 w-full max-w-4xl">
          <img
            src={product.imageURL || ""}
            alt={product.slug}
            className="max-w-sm rounded-md border border-slate-200 shadow-lg"
          />

          <div className="flex flex-col flex-grow gap-4 w-full lg:w-1/3">
            <header className="text-2xl font-bold">
              <h1>{product.name}</h1>
            </header>
            <section className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-rose-700">
                Rp {product.price.toLocaleString("id-ID")}
              </h2>
              <p>{product.description}</p>
              <span className="font-semibold">
                Sold Quantity: {product.soldQuantity}
              </span>
            </section>

            {!userSession?.id && (
              <section>
                <Button className="w-full">
                  <Link to={`/login?redirectTo=/products/${product.slug}`}>
                    + Add to Cart
                  </Link>
                </Button>
              </section>
            )}

            {userSession?.id && (
              <Form
                method="post"
                className="flex justify-center items-center mt-10">
                <input hidden name="id" defaultValue={product.id} />
                <ButtonLoading
                  type="submit"
                  isSubmitting={isSubmitting}
                  submittingText="Adding to Cart..."
                  className="w-full">
                  + Add to Cart
                </ButtonLoading>
              </Form>
            )}
          </div>
        </article>
      </main>
    </Layout>
  );
}

export const action = async ({ request }: ActionArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!userSession.id) return null;

  const formData = await request.formData();
  const submission = parse(formData);

  const productId = submission.payload.id;

  const existingCart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
    include: { cartItems: true },
  });
  if (!existingCart) return null;

  // find the existing cart item with the specified id
  const existingCartItem = existingCart?.cartItems.find(
    (item) => item.productId === productId
  );

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  const price = product?.price || 0;
  const totalPrice = price * (existingCartItem?.quantity || 1);

  // 1st scenario: product is not in the cart yet
  if (!existingCartItem) {
    await prisma.cartItem.create({
      data: {
        cartId: existingCart.id,
        productId: productId,
        quantity: 1,
        price: price,
        totalPrice: totalPrice,
      },
    });
    return redirect("/cart");
  }

  // 2nd scenario: product is already in the cart
  await prisma.cartItem.update({
    where: { id: existingCartItem.id },
    data: {
      quantity: { increment: 1 }, // Increment the quantity
      price: price,
      totalPrice: totalPrice,
    },
  });

  return redirect("/cart");
};
