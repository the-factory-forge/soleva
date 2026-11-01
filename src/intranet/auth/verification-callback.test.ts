import { expect, test } from "vite-plus/test";

import { verificationLoginCallback } from "./verification-callback";

test("verification keeps the issued token and uses a localized, host-owned login callback", () => {
  for (const requested of ["/de/intranet", "https://foreign.example/de/account"]) {
    const url = new URL("https://site.example/api/auth/verify-email?token=issued-token");
    url.searchParams.set("callbackURL", requested);
    const result = new URL(
      verificationLoginCallback(url.toString(), "person+test@example.test", "https://site.example"),
    );
    expect(result.searchParams.get("token")).toBe("issued-token");
    const callback = new URL(result.searchParams.get("callbackURL")!);
    expect(callback.origin + callback.pathname).toBe("https://site.example/de/login");
    expect(callback.searchParams.get("email")).toBe("person+test@example.test");
    expect(callback.searchParams.get("verified")).toBe("true");
  }
});

test("missing verification callback uses the default locale", () => {
  const result = new URL(
    verificationLoginCallback(
      "https://site.example/api/auth/verify-email?token=x",
      "person@example.test",
      "https://site.example",
    ),
  );
  expect(new URL(result.searchParams.get("callbackURL")!).pathname).toBe("/fr/login");
});
