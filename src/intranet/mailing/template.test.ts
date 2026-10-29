import { copyFile, mkdir, writeFile } from "node:fs/promises";

import { afterEach, expect, test, vi } from "vite-plus/test";

import { sendResendEmail } from "#/intranet/components/forge/plugins/mailing/resend.server";
import de from "#/intranet/i18n/de.json";
import en from "#/intranet/i18n/en.json";
import fr from "#/intranet/i18n/fr.json";
import it from "#/intranet/i18n/it.json";
import { locales } from "#/lib/i18n/config";
import { SITE_NAME } from "#/lib/site/constants";

import { authEmailKinds, renderAuthEmail } from "./template";

vi.mock("varlock/env", () => ({ ENV: { VITE_BASE_URL: "https://preview.example.test" } }));
afterEach(() => vi.unstubAllGlobals());
const baseUrl = "https://preview.example.test";
const logoPath = "/images/soleva-icon.png";

test.each(locales.flatMap((locale) => authEmailKinds.map((kind) => ({ locale, kind }))))(
  "renders $kind in $locale with the site brand and existing copy",
  async ({ locale, kind }) => {
    vi.stubGlobal("fetch", () => {
      throw new Error("Rendering must not send mail");
    });
    const url = new URL(
      kind === "verification"
        ? "/api/auth/verify-email?token=synthetic"
        : "/api/auth/reset-password/synthetic",
      baseUrl,
    );
    url.searchParams.set(
      "callbackURL",
      `${baseUrl}/${locale}/${kind === "verification" ? "login" : "reset-password"}`,
    );
    const email = await renderAuthEmail({ kind, locale, url: url.href, baseUrl });
    const dict = { fr, en, de, it }[locale];
    const body =
      kind === "verification"
        ? dict.employees.verificationBody
        : kind === "invitation"
          ? dict.employees.invitationBody
          : dict.auth.resetEmailBody;
    expect(email.text).toContain(body);
    expect(email.text).toContain(SITE_NAME);
    expect(email.text).toContain(email.subject);
    expect(email.text).toContain(url.href);
    expect(email.html).toContain(`lang="${locale}"`);
    expect(email.html).toContain(`${baseUrl}${logoPath}`);
    expect(email.html).toContain("#ff803e");
    expect(email.html).toContain("Montserrat, Arial, Helvetica, sans-serif");
    expect(email.html).not.toMatch(/The Corner|Northstar|Pinewood|<script|var\(--/);
    if (process.env.MAILING_PREVIEW === "1") {
      await mkdir(".cache/mailing", { recursive: true });
      const id = `${locale}-${kind}`;
      // Only the preview asset URL changes so the HTML can also open directly from disk.
      await Promise.all([
        writeFile(
          `.cache/mailing/${id}.html`,
          email.html.replaceAll(`${baseUrl}${logoPath}`, "./logo.png"),
        ),
        writeFile(`.cache/mailing/${id}.txt`, email.text),
        writeFile(
          `.cache/mailing/${id}.json`,
          JSON.stringify({ id, locale, kind, ...email }, null, 2),
        ),
        copyFile(`public${logoPath}`, ".cache/mailing/logo.png"),
      ]);
    }
  },
);

test("rejects unsafe action URLs before sending", async () => {
  for (const url of ["javascript:alert(1)", "/relative", "https://user:pass@example.test"]) {
    await expect(
      renderAuthEmail({ kind: "invitation", locale: "fr", url, baseUrl }),
    ).rejects.toThrow();
  }
});

test("sends HTML and text together and reports provider failures", async () => {
  const transport = vi.fn().mockResolvedValue(Response.json({ id: "test" }));
  vi.stubGlobal("fetch", transport);
  const email = await renderAuthEmail({
    kind: "verification",
    locale: "fr",
    url: `${baseUrl}/verify`,
    baseUrl,
  });
  const config = { apiKey: "test-key", from: "Test <accounts@example.test>" };
  const outgoing = { to: "recipient@example.test", ...email };
  await sendResendEmail(config, outgoing);
  const body = JSON.parse(transport.mock.calls[0][1].body);
  expect(body).toEqual({
    from: config.from,
    to: [outgoing.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  transport.mockResolvedValue(new Response(null, { status: 503 }));
  await expect(sendResendEmail(config, outgoing)).rejects.toThrow("Email delivery failed.");
  transport.mockRejectedValue(new Error("Network unavailable"));
  await expect(sendResendEmail(config, outgoing)).rejects.toThrow("Network unavailable");
});
