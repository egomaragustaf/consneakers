import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { authenticator } from "~/services";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export default function Route() {
  return <Outlet />;
}
