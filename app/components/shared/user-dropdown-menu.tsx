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
  const { userSession } = useRootLoaderData();

  if (!userSession) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              className="w-8"
              src={createAvatarImageURL(userSession?.id)}
              alt={userSession?.id}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56 mt-2">
        <DropdownMenuLabel>
          <h5>{userSession?.id}</h5>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

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

          <DropdownMenuItem>
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

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
