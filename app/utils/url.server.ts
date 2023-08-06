import type { LoaderArgs } from "@remix-run/node";

export function getSearchQuery({ request }: Pick<LoaderArgs, "request">) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") || ""
    return { q }
  }
