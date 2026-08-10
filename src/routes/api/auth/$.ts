import { createFileRoute } from "@tanstack/react-router";

import { auth } from "#/lib/auth/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        if (!auth) {
          return new Response("Not Found", { status: 404 });
        }
        return auth.handler(request);
      },
      POST: ({ request }) => {
        if (!auth) {
          return new Response("Not Found", { status: 404 });
        }
        return auth.handler(request);
      },
    },
  },
});
