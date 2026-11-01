import { createHash, randomUUID } from "node:crypto";

import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

const workerSeed = randomUUID();

/** Keep each named client stable within a test, including its browser and API calls. */
export function clientIP(client = "default") {
  const { testId, retry, repeatEachIndex } = base.info();
  const subnet = createHash("sha256")
    .update(JSON.stringify([workerSeed, testId, retry, repeatEachIndex, client]))
    .digest("hex");
  // Better Auth groups IPv6 by /64; changing only the last segment would still collide.
  return `fd00:${subnet.slice(0, 4)}:${subnet.slice(4, 8)}:${subnet.slice(8, 12)}::1`;
}

export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, use) => {
    await use({ ...extraHTTPHeaders, "x-forwarded-for": clientIP() });
  },
});
