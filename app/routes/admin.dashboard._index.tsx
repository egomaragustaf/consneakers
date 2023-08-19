import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { useLoaderData } from "@remix-run/react";
import { Sidebar, Layout } from "~/components";

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

  if (!user) {
    return (
      <Layout>
        <p>Sorry something went wrong</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex gap-8 justify-start items-start min-h-screen">
        <div className="w-60 flex">
          <Sidebar />
        </div>

        <div>
          <header className="space-y-2">
            <h1 className="text-2xl">Welcome, {user.username}!</h1>
          </header>
        </div>
      </main>
    </Layout>
  );
}
