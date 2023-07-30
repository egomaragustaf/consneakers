import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";

export const loader = async ({ request }: LoaderArgs) => {
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

  return json({ cart: existingCart });
};

export default function RouteComponent() {
  const { cart } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </Layout>
  );
}
