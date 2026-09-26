import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_guest/app")({
  beforeLoad: () => {
    throw redirect({ href: "/fr/intranet" });
  },
});
