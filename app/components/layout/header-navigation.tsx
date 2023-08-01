import { Link } from "@remix-run/react";
import { Input } from "../ui";

export function Navigation() {
  return (
    <header className="z-10 flex w-full items-center justify-between gap-6 px-20 bg-zinc-800 text-white">
      <div>
        <span>CONSNEAKERS</span>
      </div>

      <div className="w-full py-4">
        <Input className="max-w-2xl" />
        <nav className="w-full max-w-md text-sm flex justify-start items-center">
          <ul className="flex w-full gap-8 p-2">
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            <li>
              <Link to={`/`}>About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
