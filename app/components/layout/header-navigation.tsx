import { Link } from "@remix-run/react";

export function Navigation() {
  return (
    <header className="z-10 flex w-full items-center justify-center border-t-2">
      <nav className="w-full max-w-sm">
        <ul className="flex justify-between gap-0 p-2">
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/`}>About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
