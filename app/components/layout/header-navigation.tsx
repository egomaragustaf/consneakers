import { Link, NavLink } from "@remix-run/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { UserDropdownMenu, SearchForm } from "~/components";
import { useRootLoaderData } from "~/hooks";
import type { UserData } from "~/services";

const navPublicItems = [
  { to: "/", text: "Home" },
  {
    to: "/products",
    text: "Products",
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
  const { userData } = useRootLoaderData();

  return (
    <header className="z-10 sticky backdrop-blur top-0 flex items-center justify-center gap-6 px-4 lg:px-20 bg-zinc-900/95 text-white">
      <Link to={`/`}>
        <span>
          <img
            src="/images/logo-consneakers.png"
            alt="logo-consneakers"
            className="w-12 lg:w-16"
          />
        </span>
      </Link>

      <div className="w-full py-4 flex flex-col gap-2">
        <SearchForm />
        <nav className="w-full max-w-md text-base flex justify-start items-center">
          <ul className="flex w-full gap-8 font-semibold">
            {navPublicItems.map((navPublicItem) => {
              return (
                <li key={navPublicItem.to}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-rose-400 hover:text-white"
                        : "text-white hover:text-rose-400"
                    }
                    to={navPublicItem.to}>
                    {navPublicItem.text}
                  </NavLink>
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
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-rose-400 hover:text-white"
                        : "text-white hover:text-rose-400"
                    }
                    to={navUnauthenticatedItem.to}>
                    {navUnauthenticatedItem.text}
                  </NavLink>
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
                  {navAuthenticatedItem.to === "/profile" && userData ? (
                    <UserDropdownMenu key={navAuthenticatedItem.text} />
                  ) : (
                    <NavLink
                      to={`/cart`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-rose-400 hover:text-white"
                          : "text-white hover:text-rose-400"
                      }>
                      {navAuthenticatedItem.icon}
                    </NavLink>
                  )}
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
  userData: UserData | undefined
) {
  return location?.pathname === `/${userData?.username}`;
}
