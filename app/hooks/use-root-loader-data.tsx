import { useMemo } from "react";
import { useMatches } from "@remix-run/react";

import type { UserSession } from "~/services";

export type RootLoaderData = {
  userSession: UserSession | undefined;
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
    userSession: data?.userSession,
  };
}
