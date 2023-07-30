import { parse } from "@conform-to/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";
import { Layout } from "~/components";
import { prisma } from "~/db.server";

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
  const { state } = useNavigation();
  const busy = state === "submitting";

  if (!product) {
    return (
      <Layout>
        <h1>404 product not found</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="w-full flex flex-col gap-8 justify-center items-center">
        <pre>{JSON.stringify(product, null, 2)}</pre>
        <Form method="post">
          <input hidden name="id" defaultValue={product.id} />
          <button type="submit" disabled={busy}>
            {busy ? "Menunggu..." : "+ Keranjang"}
          </button>
        </Form>
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
