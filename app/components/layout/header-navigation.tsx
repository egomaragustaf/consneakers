import { Link } from "@remix-run/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { Avatar, AvatarImage, SearchForm } from "~/components";
import { useRootLoaderData } from "~/hooks";
import type { UserSession } from "~/services";
import { createAvatarImageURL } from "~/utils";

const navPublicItems = [
  { to: "/", text: "Home" },
  {
    to: "/about",
    text: "About",
  },
];

const navUnauthenticatedItems = [
  { to: "/login", text: "Login" },
  {
    to: "/signup",
    text: "Sign Up",
  },
];

const navAuthenticatedItems = [
  {
    to: "/cart",
    text: "Cart",
    icon: <AiOutlineShoppingCart className="text-3xl" />,
  },
  {
    to: "/profile",
    text: "Profile",
  },
];

export function Navigation() {
  const { userSession } = useRootLoaderData();

  return (
    <header className="z-10 fixed flex w-full items-center justify-between gap-6 px-4 md:px-20 bg-zinc-800 text-white">
      <Link to={`/`}>
        <span>
          <img
            src="/images/logo-consneakers.png"
            alt="logo-consneakers"
            className="w-12 md:w-16"
          />
        </span>
      </Link>

      <div className="w-full py-4 flex flex-col gap-2">
        <SearchForm />
        <nav className="w-full max-w-md text-sm flex justify-start items-center">
          <ul className="flex w-full gap-8">
            {navPublicItems.map((navPublicItem) => {
              return (
                <li key={navPublicItem.to}>
                  <Link
                    className="text-white font-semibold"
                    to={navPublicItem.to}>
                    {navPublicItem.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="text-sm w-96">
        {!userSession && (
          <div className="flex justify-evenly items-center">
            {navUnauthenticatedItems.map((navUnauthenticatedItem) => {
              return (
                <span key={navUnauthenticatedItem.to}>
                  <Link
                    className="text-white font-semibold"
                    to={navUnauthenticatedItem.to}>
                    {navUnauthenticatedItem.text}
                  </Link>
                </span>
              );
            })}
          </div>
        )}

        {userSession && (
          <div className="flex justify-evenly items-center">
            {navAuthenticatedItems.map((navAuthenticatedItem) => {
              return (
                <span key={navAuthenticatedItem.to}>
                  <Link to={navAuthenticatedItem.to}>
                    {navAuthenticatedItem.to === "/profile" && userSession ? (
                      <Avatar>
                        <AvatarImage
                          className="w-8"
                          src={createAvatarImageURL(userSession?.id)}
                          alt={userSession?.id}
                        />
                      </Avatar>
                    ) : (
                      navAuthenticatedItem.icon
                    )}
                  </Link>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

export function checkIfActiveUsername(
  location: Location,
  userSession: UserSession | undefined
) {
  return location?.pathname === `/${userSession?.id}`;
}
