import { useSearchParams } from "@remix-run/react";
import { Input } from "~/components";

interface Props {
  action?: string;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  action = "/search",
  placeholder = "Search...",
}: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <form method="GET" action={action} className="w-full">
      <fieldset className="relative flex items-center gap-1">
        <label htmlFor="search" hidden />
        <Input
          id="search"
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={query}
          autoComplete="off"
          className="max-w-3xl bg-zinc-700 focus:bg-zinc-100 transition duration-100 text-black"
        />
      </fieldset>
    </form>
  );
}
