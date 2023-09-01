import { useSearchParams } from "@remix-run/react";
import { FaSearch } from "react-icons/fa";
import { Input } from "~/components";

interface Props {
  action?: string;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  action = "/products",
  placeholder = "Search...",
}: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <form method="GET" action={action} className="w-full">
      <fieldset className="group relative flex items-center gap-1">
        <label htmlFor="search" hidden />
        <Input
          id="searchProducts"
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={query}
          autoComplete="off"
          className="block px-3 ps-12 w-full rounded-full max-w-3xl bg-zinc-700 focus:bg-zinc-100 focus:text-black transition duration-200"
        />
        <span className="pointer-events-none absolute flex ps-3">
          <FaSearch className="h-6 w-6 text-muted-foreground group-focus-within:text-primary" />
        </span>
      </fieldset>
    </form>
  );
}
