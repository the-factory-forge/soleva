import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "#/lib/site/constants";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const content = `User-agent: *
Allow: /
Disallow: /api/auth/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;
        return new Response(content, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
