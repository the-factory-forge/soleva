import { randomUUID } from "node:crypto";

import { expect, test, clientIP } from "./test";

for (const journey of ["first", "second"]) {
  test(`${journey} journey has its own bucket shared by browser and API requests`, async ({
    context,
    request,
    baseURL,
  }) => {
    // Invalid input exercises the real limiter without accounts or database writes.
    const options = { headers: { origin: baseURL! }, data: {} };
    expect((await context.request.post("/api/auth/sign-in/email", options)).status()).toBe(400);
    expect((await request.post("/api/auth/sign-in/email", options)).status()).toBe(400);
    expect((await context.request.post("/api/auth/sign-in/email", options)).status()).toBe(400);
    const limited = await request.post("/api/auth/sign-in/email", {
      ...options,
      headers: { ...options.headers, "x-forwarded-for": clientIP().replace("::1", "::2") },
    });
    expect(limited.status()).toBe(429);
    expect(Number(limited.headers()["x-retry-after"])).toBeGreaterThan(0);
    expect(Number(limited.headers()["x-retry-after"])).toBeLessThanOrEqual(10);
  });
}

test("unresolved IPs fail closed while a valid single IP has its own bucket", async ({
  request,
}) => {
  const path = `/api/auth/rate-limit-probe-${randomUUID()}`;
  for (let attempt = 0; attempt < 30; attempt++) {
    expect((await request.get(path, { headers: { "x-forwarded-for": "" } })).status()).toBe(404);
  }
  for (const ip of ["", "invalid", "198.51.100.1, 192.0.2.10"]) {
    expect((await request.get(path, { headers: { "x-forwarded-for": ip } })).status()).toBe(429);
  }
  expect(
    (
      await request.get(path, { headers: { "x-forwarded-for": clientIP("198.51.100.1") } })
    ).status(),
  ).toBe(404);
});
