import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { useLoaderData } from "@remix-run/react";
import {
  Sidebar,
  Layout,
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "~/components";
import { useRootLoaderData } from "~/hooks";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Admin Dahsboard" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!userSession?.id) return redirect("/logout");

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
  });
  if (!user) return redirect("/logout");

  return json({ user });
};

export default function Route() {
  const { user } = useLoaderData<typeof loader>();
  const { cart } = useRootLoaderData();
  const isAdmin = user?.username === "admin";

  if (!user || !isAdmin) {
    return (
      <Layout>
        <main className="flex gap-8 justify-start items-start min-h-screen">
          <p>Sorry something went wrong</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex gap-8 justify-start items-start min-h-screen">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div className="flex flex-col gap-4">
          <header className="space-y-2">
            <h1 className="text-2xl">Welcome, {user.username}!</h1>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-zinc-300 hover:bg-zinc-50 rounded-xl w-52 p-4">
              <CardHeader className="flex items-center justify-start">
                <h1>Cart Items Quantity</h1>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-4xl font-bold text-start">
                  {cart?.totalQuantity}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
}
