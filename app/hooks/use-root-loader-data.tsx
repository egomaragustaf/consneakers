import { useMemo } from "react";
import { useMatches } from "react-router";

import type { UserData, UserSession } from "~/services";
import type { Cart, CartItem, Product } from "@prisma-generated/client";

export type RootLoaderData = {
  isDevelopment: boolean;
  userSession: UserSession | undefined;
  userData: UserData | undefined;
  cart:
    | (Cart & {
        cartItems: (CartItem & { product: Product })[];
      })
    | null;
  isAdmin: boolean;
  env: {
    MAPBOX_PUBLIC_TOKEN: string;
  };
};

export function useMatchesData(
  routeId: string
): Record<string, unknown> | RootLoaderData {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === routeId),
    [matchingRoutes, routeId]
  );
  return route?.data as Record<string, unknown> | RootLoaderData;
}

export function useRootLoaderData() {
  const data = useMatchesData("root") as RootLoaderData;

  return {
    isDevelopment: process.env.NODE_ENV === "development" ? true : false,
    userSession: data?.userSession,
    userData: data?.userData,
    cart: data?.cart,
    env: data?.env,
    isAdmin: data?.isAdmin,
  };
}
