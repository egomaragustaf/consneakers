import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarImage,
} from "~/components";
import { prisma } from "~/db.server";
import { authenticator } from "~/services";
import { createAvatarImageURL } from "~/utils";

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

export function UserDropdownMenu({
  align = "end",
}: {
  align?: "center" | "start" | "end" | undefined;
}) {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return <p>Invalid user</p>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              className="w-8"
              src={createAvatarImageURL(user?.username)}
              alt={user?.username}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56 mt-2">
        <DropdownMenuLabel>
          <h5>Hi, {user?.username}!</h5>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Profile</span>
          </DropdownMenuItem>

          <NavLink to={`/admin/dashboard`}>
            <DropdownMenuItem>
              <span>Dashboard</span>
            </DropdownMenuItem>
          </NavLink>

          <DropdownMenuItem>
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <NavLink to="/logout">
          <DropdownMenuItem>
            <span>Log out</span>
          </DropdownMenuItem>
        </NavLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
