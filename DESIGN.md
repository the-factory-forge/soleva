---
name: "Soleva"
description: Existing customer design preserved during Forge template updates.
colors:
  primary: "#ff803e"
  background: "#ffffff"
  foreground: "#1f2a2a"
typography:
  display:
    fontFamily: "Montserrat"
  body:
    fontFamily: "Montserrat"
rounded:
  base: "0.75rem"
---

# Design system: Soleva

## Overview

Light-only public pages with orange accents, Montserrat, project photography and the existing hero video.
This is an implementation record from 2026-10-09, not a replacement visual direction.
The selected tokens describe the default public surface. Contextual sections and existing
dark-mode overrides remain in CSS and must not be flattened into this small token inventory.

## Colors

Use the site's semantic foreground/background pairs and existing contrast rules.
Read [the stylesheet](src/styles.css) and [global styles](src/styles/globals.css)
before editing; inherited template colors must not replace customer values.
Status colors describe state independently of the brand palette.

## Typography

Preserve the display/body roles above, existing font files, fallbacks and selective preloads.
Retain the implemented heading scale and content hierarchy.

## Layout

Preserve customer page composition, container widths and responsive navigation.
Keep related controls together and allow translated labels to wrap on small screens.
Intranet screens follow the host shell and existing field/error conventions.

## Elevation & Depth

Reuse the actual button, card, overlay and dialog treatments in the component source.
Do not introduce a new shadow system during a foundation update.

## Shapes

The base radius above is the current theme value. Preserve component-specific radii,
image crops and brand marks instead of normalizing them to template defaults.

## Components

Use the site's existing navigation, footer, buttons, form controls and consent banner.
Preserve loading/error/disabled states, visible keyboard focus and accessible names.
Keep motion visible before hydration and honor reduced-motion preferences.

## Do's and Don'ts

- Do retain customer copy, photographs, logos and action destinations.
- Do inspect the existing desktop and mobile surface before visual changes.
- Do update this record alongside an intentional identity change.
- Don't copy the template's sample content, palette, fonts or page arrangement.
- Don't treat these maintenance notes as approval for a redesign.
