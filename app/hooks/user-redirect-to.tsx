import { useSearchParams } from "react-router";

export function useRedirectTo() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  return { searchParams, redirectTo };
}
