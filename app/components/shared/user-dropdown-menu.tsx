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

export function UserDropdownMenu() {
  const { userSession } = useRootLoaderData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage
              className="w-8"
              src={createAvatarImageURL(userSession?.id)}
              alt={userSession?.id}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 overflow-scroll">
        <DropdownMenuLabel>
          <h5>{userSession?.id}</h5>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to={`/admin/dashboard`}>
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/logout">
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
