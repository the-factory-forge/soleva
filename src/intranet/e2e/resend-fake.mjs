// Loaded only by Playwright's production server. Intercept the provider boundary
// so the real verification flow runs without delivering mail to anyone.
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = input instanceof Request ? input.url : String(input);
  if (url !== "https://api.resend.com/emails") return originalFetch(input, options);

  const message = JSON.parse(options.body);
  if (options.headers.Authorization !== "Bearer e2e-email-key") {
    return Response.json({ message: "Unexpected test credentials" }, { status: 401 });
  }
  if (message.to[0].startsWith("delivery-failure-")) {
    return Response.json({ message: "Delivery unavailable" }, { status: 503 });
  }
  const key = createHash("sha256").update(message.to[0]).digest("hex");
  await mkdir(".cache/e2e-emails", { recursive: true });
  await writeFile(`.cache/e2e-emails/${key}.json`, JSON.stringify(message));
  return Response.json({ id: key });
};
