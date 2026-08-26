import { createFileRoute, notFound } from "@tanstack/react-router";

// Catch-all for unmatched paths under a locale (e.g. /fr/zzz). Without it the
// router fuzzy-matches nothing and soft-redirects to "/" instead of a real 404.
// Throwing notFound() renders the closest notFoundComponent (the localized
// DefaultNotFound on the $lang layout) with a proper 404 status.
export const Route = createFileRoute("/_site/$lang/$")({
  beforeLoad: () => {
    throw notFound();
  },
});
