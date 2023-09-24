import {
  type LoaderArgs,
  json,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./tailwind.css";
import { authenticator } from "./services";
import NProgress from "nprogress";
import { useEffect } from "react";
import { model } from "~/models";
import { prisma } from "./db.server";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

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
        <LiveReload />
      </body>
    </html>
  );
}

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request);
  const userData = await model.user.query.getForSession({
    id: String(userSession?.id),
  });

  if (userSession && !userData) {
    return redirect(`/logout`);
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession?.id },
  });

  return json({
    userSession,
    userData,
    cart,
    env: { MAPBOX_PUBLIC_TOKEN: String(process.env.MAPBOX_PUBLIC_TOKEN) },
  });
};
