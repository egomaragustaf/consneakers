import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { redirect } from "react-router";

import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { useLoaderData } from "react-router";
import {
  Sidebar,
  Layout,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  AvatarImage,
} from "~/components";
import { createAvatarImageURL } from "~/utils";
import { useRootLoaderData } from "~/hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Profile" },
    { name: "description", content: "AdminProfile" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  if (!userSession?.id) return redirect("/logout");

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    include: { locations: true },
  });
  if (!user) return redirect("/logout");

  return { user };
};

export default function Route() {
  const { user } = useLoaderData<typeof loader>();
  const { isAdmin } = useRootLoaderData();

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
        <div className="lg:w-60 flex">
          <Sidebar />
        </div>

        <article className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">User Profile</h2>
          <Avatar>
            <AvatarImage
              className="w-20 rounded-full"
              src={createAvatarImageURL(user?.username)}
              alt={user?.username}
            />
          </Avatar>
          <Table className="bg-zinc-100 rounded">
            <TableBody>
              <TableRow>
                <TableCell className="text-left w-36">Name</TableCell>
                <TableCell className="text-left w-4">:</TableCell>
                <TableCell className="text-left w-96 font-semibold text-base">
                  {user?.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-left w-36">Username</TableCell>
                <TableCell className="text-left w-4">:</TableCell>
                <TableCell className="text-left w-96">
                  {user?.username}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-left w-36">Email</TableCell>
                <TableCell className="text-left w-4">:</TableCell>
                <TableCell className="text-left w-96">{user?.email}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 className="text-lg font-semibold">User Address</h2>
          {user?.locations.map((location) => {
            return (
              <div key={location.id}>
                <Table className="bg-zinc-100 rounded">
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-left w-36">Label</TableCell>
                      <TableCell className="text-left w-4">:</TableCell>
                      <TableCell className="text-left w-96 font-semibold text-base">
                        {location.label}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-left w-36">Adrress</TableCell>
                      <TableCell className="text-left w-4">:</TableCell>
                      <TableCell className="text-left w-96">
                        {location.subDistrict}, {location.district},{" "}
                        {location.city}, {location.province},{" "}
                        {location.countryCode}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-left w-36">
                        Street Detail
                      </TableCell>
                      <TableCell className="text-left w-4">:</TableCell>
                      <TableCell className="text-left w-96">
                        {location.streetDetails}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-left w-36">
                        Coordinate
                      </TableCell>
                      <TableCell className="text-left w-4">:</TableCell>
                      <TableCell className="text-left w-96">
                        {String(location.latitude)}, {String(location.longitude)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </article>
      </main>
    </Layout>
  );
}
