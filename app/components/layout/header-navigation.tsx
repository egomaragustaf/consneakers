import { Link } from "@remix-run/react";
import { SearchForm } from "~/components";
import { useRootLoaderData } from "~/hooks";

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
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            <li>
              <Link to={`/`}>About</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-sm">
        {!userSession && (
          <Link to={`/login`}>
            <span>Login</span>
          </Link>
        )}

        {userSession && (
          <Link to={`/logout`}>
            <span>Logout</span>
          </Link>
        )}
      </div>
    </header>
  );
}
