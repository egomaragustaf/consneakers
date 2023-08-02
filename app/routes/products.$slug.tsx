import { parse } from "@conform-to/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";
import { prisma } from "~/db.server";
import { Layout, Button } from "~/components";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Consneakers" },
    { name: "description", content: "Welcome to Consneakers!" },
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

export default function ProductSlugRoute() {
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
      <main className="w-full max-w-7xl flex gap-8 justify-center items-start">
        <article className="flex gap-8 w-full max-w-4xl">
          <img
            src={product.imageURL || ""}
            alt={product.slug}
            className="max-w-md rounded-md border border-slate-200"
          />

          <div className="flex flex-col flex-grow gap-4 w-1/3">
            <header className="text-2xl font-bold">
              <h1>{product.name}</h1>
            </header>
            <section className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-rose-700">
                Rp {product.price.toLocaleString("id-ID")}
              </h2>
              <p>Desciption: {product.description}</p>
              <span>Color:</span>
              <span>Size:</span>
            </section>

            <Form
              method="post"
              className="flex justify-center items-center mt-10">
              <input hidden name="id" defaultValue={product.id} />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Menunggu..." : "+ Keranjang"}
              </Button>
            </Form>
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

  const formData = await request.formData();
  const submission = parse(formData);

  const productToAdd = {
    productId: submission.payload.id,
    quantity: 1,
  };

  const existingCart = await prisma.cart.findFirst({
    where: { userId: userSession.id },
  });

  if (!existingCart) {
    await prisma.cart.create({
      data: {
        userId: userSession.id,
        cartItems: { create: productToAdd },
      },
    });
    return redirect("/cart");
  }

  await prisma.cart.update({
    where: { id: existingCart.id },
    data: { cartItems: { create: productToAdd } },
  });

  return redirect("/cart");
};
