import { useMemo } from "react";
import { useMatches } from "@remix-run/react";

import type { UserData, UserSession } from "~/services";

export type RootLoaderData = {
  isDevelopment: boolean;
  userSession: UserSession | undefined;
  userData: UserData | undefined;
};

export function useMatchesData(
  routeId: string
): Record<string, unknown> | RootLoaderData {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === routeId),
    [matchingRoutes, routeId]
  );
  return route?.data;
}

export function useRootLoaderData() {
  const data = useMatchesData("root") as RootLoaderData;

  return {
    isDevelopment: process.env.NODE_ENV === "development" ? true : false,
    userSession: data?.userSession,
    userData: data?.userData,
    ENV: {
      MAPBOX_PUBLIC_TOKEN: process.env.MAPBOX_PUBLIC_TOKEN,
    },
  };
}
