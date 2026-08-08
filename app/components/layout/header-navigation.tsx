import { useMemo } from "react";
import { Link, NavLink, useFetchers } from "react-router";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { UserDropdownMenu, SearchForm } from "~/components";
import { useRootLoaderData } from "~/hooks";

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

const CART_ACTIONS = [
  "increment-item-in-cart",
  "decrement-item-in-cart",
  "delete-item-in-cart",
];

export function Navigation() {
  const { userSession, cart, userData } = useRootLoaderData();
  const fetchers = useFetchers();

  // Optimistic cart total: committed totalQuantity plus deltas from in-flight
  // cart fetchers (the submitted "quantity" is the item's new target quantity).
  const optimisticQuantity = useMemo(() => {
    if (!cart) return 0;

    const newQuantities = new Map<string, number>();
    for (const fetcher of fetchers) {
      const formData = fetcher.formData;
      if (!formData) continue;

      const action = String(formData.get("_action") ?? "");
      if (!CART_ACTIONS.includes(action)) continue;

      const cartItemId = String(formData.get("cartItemId") ?? "");
      if (!cartItemId) continue;

      if (action === "delete-item-in-cart") {
        newQuantities.set(cartItemId, 0);
        continue;
      }

      const quantity = Number(formData.get("quantity"));
      if (Number.isFinite(quantity)) {
        newQuantities.set(cartItemId, quantity);
      }
    }

    if (newQuantities.size === 0) return cart.totalQuantity;

    let total = cart.totalQuantity;
    for (const item of cart.cartItems) {
      const newQuantity = newQuantities.get(item.id);
      if (newQuantity !== undefined) {
        total += newQuantity - item.quantity;
      }
    }
    return total;
  }, [cart, fetchers]);

  return (
    <header className="z-10 sticky backdrop-blur top-0 flex items-center justify-center gap-6 px-4 lg:px-20 bg-zinc-900/95 text-white">
      <Link to={`/`}>
        <span>
          <img
            src="/images/logo-consneakers.png"
            alt="logo-consneakers"
            className="w-24"
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
                      {cart && optimisticQuantity > 0 && (
                        <div className="-ml-2 flex h-5 w-5 items-center justify-center rounded-full text-zinc-800 bg-white">
                          {optimisticQuantity}
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
