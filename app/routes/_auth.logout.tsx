import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};
