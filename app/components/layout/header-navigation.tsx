import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { UserDropdownMenu, SearchForm } from "~/components";
import { prisma } from "~/db.server";
import { useRootLoaderData } from "~/hooks";
import { authenticator, type UserData } from "~/services";

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

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request);

  const cart = await prisma.cart.findFirst({
    where: { userId: userSession?.id },
    include: { cartItems: { include: { product: true } } },
  });

  return json({ cart });
};

export function Navigation() {
  const { userSession } = useRootLoaderData();
  const { userData } = useRootLoaderData();
  const { cart } = useLoaderData<typeof loader>() || {};

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
                      {cart?.totalQuantity !== undefined &&
                        cart?.totalQuantity > 0 && (
                          <div className="-ml-2 flex h-5 w-5 items-center justify-center rounded-full text-zinc-800 bg-white">
                            {cart?.totalQuantity}
                          </div>
                        )}
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
