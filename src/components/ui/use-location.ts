// TanStack implementation of the pathname hook (link shim family).

import { useLocation } from "@tanstack/react-router";

export function usePathname(): string {
  return useLocation().pathname;
}
