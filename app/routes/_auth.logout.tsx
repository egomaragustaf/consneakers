import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/services";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};
