import { Link } from "@remix-run/react";
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
import { useRootLoaderData } from "~/hooks";
import { createAvatarImageURL } from "~/utils";

export function UserDropdownMenu({
  align = "end",
}: {
  align?: "center" | "start" | "end" | undefined;
}) {
  const { userData } = useRootLoaderData();
  const isAdmin = userData?.username === "admin";

  if (!userData) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              className="w-8"
              src={createAvatarImageURL(userData?.username)}
              alt={userData?.username}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56 mt-2">
        <DropdownMenuLabel>
          <h5>Hi, {userData?.name}!</h5>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <Link to={`/admin/dashboard`}>
              <DropdownMenuItem>
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        {!isAdmin && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
            <Link to={`/user/dashboard`}>
              <DropdownMenuItem>
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />

        <Link to="/logout">
          <DropdownMenuItem>
            <span>Log out</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
