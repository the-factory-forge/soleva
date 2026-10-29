# Account emails

Account invitations, verification and password recovery use Registry RC6 Mailing.
The site owns its name, existing PNG logo, light palette, font stacks and existing
French, English, German and Italian copy in `src/intranet/mailing/template.ts`.
The installed renderer stays under `src/intranet/components/forge/plugins/mailing`.

`EMAIL_API_KEY`, `EMAIL_FROM` and `VITE_BASE_URL` retain their existing roles.
The logo and action URLs use the current runtime origin. Production recipients
need a publicly reachable HTTPS logo; local previews do not prove inbox delivery.
Tokens, recipients, invitation expiry/replacement, callback locales and neutral
password-recovery responses are unchanged. No database or storage migration is needed.

## Preview without delivery

```sh
vp run preview:mailing
```

This runs the same renderer used by delivery with synthetic settings and tokens.
It generates twelve `.html` and `.txt` previews under `.cache/mailing/`, covering
three messages in all four languages. Open an HTML file directly in a browser.
Only the preview logo URL is replaced with a relative copy of the existing PNG;
actual emails retain absolute URLs. No database or mail credentials are needed.
Generated files stay ignored by Git and outside public application routes.
