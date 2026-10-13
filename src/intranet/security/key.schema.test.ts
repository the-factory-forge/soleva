import { describe, expect, it } from "vite-plus/test";

import { sessionSignInMethod } from "../auth/sign-in-method";
import { agentKeySchema } from "./key.schema";

describe("agent key limits and sign-in provenance", () => {
  it("requires a name and a future expiry within 90 days", () => {
    const valid = { name: "  Integration  ", expiresAt: new Date(Date.now() + 86_400_000) };
    expect(agentKeySchema.parse(valid).name).toBe("Integration");
    for (const input of [
      { ...valid, name: " " },
      { ...valid, name: "a".repeat(101) },
      { ...valid, expiresAt: new Date(0) },
      { ...valid, expiresAt: new Date(Date.now() + 91 * 86_400_000) },
      { ...valid, expiresAt: "invalid" },
    ])
      expect(agentKeySchema.safeParse(input).success).toBe(false);
  });
  it("records the login event without guessing for existing or impersonated sessions", () => {
    expect(sessionSignInMethod("/sign-in/email")).toBe("credential");
    expect(sessionSignInMethod("/callback/:id", "github")).toBe("github");
    expect(sessionSignInMethod("/callback/google")).toBe("google");
    expect(sessionSignInMethod("/admin/impersonate-user")).toBeNull();
    expect(sessionSignInMethod()).toBeNull();
  });
});
