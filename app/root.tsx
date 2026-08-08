import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import "./tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "~/config/fonts";
import { authenticator } from "./services";
import NProgress from "nprogress";
import { useEffect } from "react";
import { model } from "~/models";
import { computeCartTotals } from "~/models/cart.server";
import { prisma } from "./db.server";

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") NProgress.done();
    else NProgress.start();
  }, [navigation.state]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await authenticator.isAuthenticated(request);
  const userData = await model.user.query.getForSession({
    id: String(userSession?.id),
  });
  const isAdmin = userData?.username === "admin";

  if (userSession && !userData) {
    return redirect(`/logout`);
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession?.id },
    include: {
      cartItems: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return {
    userSession,
    userData,
    cart: cart
      ? { ...cart, ...computeCartTotals(cart.cartItems) }
      : null,
    isAdmin,
    env: { MAPBOX_PUBLIC_TOKEN: String(process.env.MAPBOX_PUBLIC_TOKEN) },
  };
};
