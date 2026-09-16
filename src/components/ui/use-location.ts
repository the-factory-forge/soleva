"use client";

import { useLocation } from "@tanstack/react-router";

// Subscribe to client navigation as well as the initial server-rendered path.
export function usePathname(): string {
  return useLocation({ select: (location) => location.pathname });
}
