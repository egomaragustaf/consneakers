import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { useLoaderData } from "@remix-run/react";
import { Sidebar, Layout } from "~/components";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "User Dashboard" },
    { name: "description", content: "User Dahsboard" },
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
  const isAdmin = user?.username === "admin";

  if (!user || isAdmin) {
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
        <div className="lg:w-60 flex">
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
