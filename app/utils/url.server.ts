import type { LoaderFunctionArgs } from "react-router";

export function getRedirectTo(request: Request) {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirectTo") || undefined
  return redirectTo
}

export function getSearchQuery({ request }: Pick<LoaderFunctionArgs, "request">) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q") || ""
    return { q }
  }
