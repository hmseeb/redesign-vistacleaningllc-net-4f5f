# Vista Cleaning Operations — Website

A complete ground-up redesign of the Vista Cleaning Operations site: professional cleaning
services for homes, apartments, rentals and vacant properties throughout Washington, D.C.
and the surrounding Capital Region.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies, no external APIs.
Open `index.html` in a browser, or serve the folder statically.

```bash
python3 -m http.server 8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point. Semantic markup, meta/Open Graph tags, JSON-LD `HouseCleaningService` schema. |
| `styles.css` | Design system (custom properties), layout and responsive rules. |
| `script.js` | Mobile nav, FAQ accordion, quote-form validation, scroll reveal, back-to-top. |
| `favicon.svg` | Brand mark favicon. |
| `site.webmanifest` | PWA manifest. |

## Sections

Hero · trust badges · why Vista · approach · six services · service areas ·
about (family story) · FAQs · contact + quote form · closing CTA · footer.

## Business details

- **Phone:** 202-910-2247
- **Email:** info@vistacleaning.com
- **Hours:** Mon – Fri, 8am to 5pm
- **Areas:** Washington D.C., Alexandria, Arlington, Falls Church, Bethesda, Silver Spring,
  Georgetown, Shepherd Park, Brightwood, Dupont Circle

## Services

Airbnb Cleaning · Apartment Cleaning · Deep Cleaning · Move Out Cleaning ·
Move In Cleaning · Post Construction Cleaning

## Imagery

Authentic photography from the original site is preserved throughout — the logo, the review
badges, the team photos (including staff in branded Vista Cleaning polos) and real photos of
completed work in the hero, approach and about sections.

The previous site's service-card photos were generic, staged stock images and were replaced
with section-specific photography from Pexels, matched to each service and filtered for a
consistent bright, natural-light look. Every image carries descriptive, business-specific
alt text.

## Design notes

- Palette derives from the logo's brand blue (`#54C0E4`), deepened to `#1E9FC9` for
  text/UI contrast against a deep-ink (`#0B1B2B`) base.
- Responsive from 320px up; verified with no horizontal overflow at any breakpoint.
- Honors `prefers-reduced-motion`, includes a skip link, visible focus states and
  ARIA state on interactive controls.
