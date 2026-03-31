# Triple Whale Onboarding Booking Hub
## Purpose
This repo contains a single-page booking hub used as `{{booking_link}}` in the welcome email.  
The page routes customers to book by region first (`Americas`, `EMEA`, `APAC`) with a `worldwide` fallback.

## Deployment Model
This branch is a fully client-side static site.

- No serverless functions
- No backend API
- No Google Sheets dependency
- Booking, resource, add-on, and growth office-hours URLs all live in `booking-page-links.js`

## Files
- `index.html`: Single-page booking hub UI and client-side link binding.
- `booking-page-links.js`: Centralized link config for booking buttons and checklist/resource links.

## Handoff Context (From Prior Thread)
Goal: build a single-page booking hub to use as `{{booking_link}}` in the welcome email, so customers choose Americas, EMEA, or APAC first, with a worldwide fallback link.

Built file: `index.html`  
Built file: `booking-page-links.js`

What was implemented:
- Initial landing page UI in `index.html`
- Three regional booking cards (`Americas`, `EMEA`, `APAC`) plus a “worldwide availability” link
- Copy focused on “pick your nearest region first; use worldwide if needed”
- Editable link config in `booking-page-links.js`:

```js
window.BOOKING_PAGE_LINKS = {
  bookingButtons: {
    americasCard: { dataLinkKey: "americas", url: "https://example.com/americas" },
    emeaCard: { dataLinkKey: "emea", url: "https://example.com/emea" },
    apacCard: { dataLinkKey: "apac", url: "https://example.com/apac" }
  },
  additionalCoverageLink: {
    worldwideAvailability: { dataLinkKey: "worldwide", url: "https://example.com/worldwide" }
  },
  checklistSections: {
    beforeKickoff: {
      sectionKey: "beforeKickoff",
      items: [{ label: "Triple Pixel", url: "https://example.com/triple-pixel" }]
    },
    kickoffOutcomes: {
      sectionKey: "kickoffOutcomes",
      items: [{ label: "Summary Dashboard", url: "https://example.com/summary-dashboard" }]
    }
  }
};
```

- `index.html` loads `booking-page-links.js` and maps URLs via `data-link` and `data-resource-list`, so booking and checklist links are editable in one place.
- For booking buttons and worldwide link, edit `url` values under objects with `dataLinkKey`.
- For checklist bullets, add/remove items under `checklistSections.<section>.items`.
- Added onboarding-themed content sections from the welcome email:
  - “Connect what you can (optional)” with Triple Pixel, integrations, and tracking/UTM rules
  - “Kickoff agenda” with Summary, Attribution, Creative Analysis, and Cohort/Segments
  - Note that Customer Success handoff happens after kickoff

Current status noted in that prior thread:
- Brand kit restyle request (Triple Whale colors/typography/tone rules) had been submitted but was not yet applied
- Links were still placeholder URLs in `booking-page-links.js`

## Current Status (Updated Mar 19, 2026)
- Brand-kit styling has now been applied to `index.html` (color, typography, spacing, tone, CTA/focus states).
- Booking URLs in `booking-page-links.js` are still placeholders and should be replaced with production links.
- The two onboarding resource cards now support MSP-aware link sets in `booking-page-links.js`.
- Booking links now also support cohort-aware routing for `?cohort=` with default, `smb`, `mm`, and `ent` router sets, plus a dedicated `growth` office-hours experience.
- `?msp=custom` now overrides all four booking links with the custom-team routers instead of using shared or cohort booking routes.

## URL-Driven Personalization
The page now reads `?cohort=`, `?msp=`, `?headless=`, `?package=`, `?hasConversion=`, and `?hasRetention=` from the URL and swaps booking links and onboarding resources accordingly.

## Cohort-Aware Booking Links
- Supported values: `smb`, `mm`, `ent`, `growth`
- Matching is case-insensitive and ignores spaces / punctuation
- Missing, blank, or unknown `cohort` values fall back to the `tw_cohort` cookie when present, otherwise keep the default shared booking routers
- A valid `?cohort=` value updates the `tw_cohort` cookie
- Blank or invalid `?cohort=` values do not overwrite the cookie
- `booking-page-links.js` stores the default regional URLs plus cohort-specific overrides under each booking button and the worldwide link
- `?cohort=growth` hides the Americas, EMEA, APAC, and worldwide sections and replaces them with the Customer Success Office Hours schedule
- When the URL does not include `cohort`, the page falls back to the saved `tw_cohort` cookie, including restoring the `growth` office-hours experience on later visits
- `msp=custom` takes precedence over cohort routing and swaps the Americas, EMEA, APAC, and worldwide links to the custom-team booking routers

## Static Growth Office Hours Source
- Growth office-hours sessions are defined directly in `booking-page-links.js` -> `growthExperience`
- Sessions can be turned on or off in `booking-page-links.js` with each entry's `enabled` flag
- Booking URLs are defined in `booking-page-links.js` -> `bookingButtons` and `additionalCoverageLink`
- Configuration, activation, and add-on URLs are defined in `booking-page-links.js` via `CONFIGURATION_URLS` and `ACTIVATION_URLS`
- Updating links or office-hours sessions now only requires editing this repo; no Netlify function or Google Sheet sync is involved

## MSP-Aware Resource Links
The page also reads `?msp=`, `?headless=`, `?package=`, `?hasConversion=`, and `?hasRetention=` from the URL and swaps the onboarding resource cards accordingly.

- Supported values: `Shopify`, `WooCommerce`, `BigCommerce`, `custom`
- Matching is case-insensitive and ignores spaces / punctuation
- Missing, blank, or unknown `msp` values fall back to the `tw_msp` cookie when present, otherwise default to Shopify
- A valid `?msp=` value updates the `tw_msp` cookie
- Blank or invalid `?msp=` values do not overwrite the cookie
- `?msp=custom` also overrides all booking buttons and the worldwide link with the custom-team booking URLs
- `?headless=true` swaps the Triple Pixel install bullet to one shared headless setup URL and updates the `tw_headless` cookie
- `?headless=false` turns those extra docs off and updates the `tw_headless` cookie
- If `headless` is missing, the page falls back to `tw_headless` when present, otherwise defaults to `false`
- Missing, blank, or unknown `package` values fall back to `tw_package` when present, otherwise default to `advanced`
- A valid `?package=` value updates the `tw_package` cookie
- Blank or invalid `?package=` values do not overwrite the cookie
- `?package=starter` removes Sonar Optimize from configuration and hides Creative Analysis, Cohort Analysis, and Customer Segments from activation
- `?package=professional` includes the full advanced/default activation set plus MMM and Incrementality
- Missing, blank, or `?package=advanced` keeps the default experience
- `?hasConversion=true` adds the compact Conversion add-on callout under Configuration and updates the `tw_hasconversion` cookie
- `?hasRetention=true` adds the compact Retention add-on callout under Activation and updates the `tw_hasretention` cookie
- If either flag is missing or blank, the page falls back to its matching cookie when present
- Only `true` is treated as an active value for those feature flags

Edit platform-specific resource links in:

- `booking-page-links.js` -> `checklistSections.beforeKickoff.itemsByMsp`
- `booking-page-links.js` -> `checklistSections.beforeKickoff.headlessItemOverrides`
- `booking-page-links.js` -> `checklistSections.<section>.packageOverrides`
- `booking-page-links.js` -> `checklistSections.<section>.callout`
- `booking-page-links.js` -> `checklistSections.kickoffOutcomes.items`

Configuration is now mostly platform-agnostic: Triple Pixel is the one MSP-specific setup doc, and `headless=true` can still override that one item with the shared headless URL. Activation uses one shared resource list for all brands unless a package rule trims specific trainings. Add-ons render as separate bottom-of-card callouts instead of blending into the main checklist. Resource bullets can also include multiple inline links in a single bullet when needed, including the combined Sonar, costs, and mapping rows in Configuration. `booking-page-links.js` is now split into clear `CONFIGURATION_URLS` and `ACTIVATION_URLS` blocks near the top so URLs and exceptions are easier to update. The page also surfaces a small platform context label for non-Shopify MSPs so revisits still visibly reflect the active platform when needed.

## Brand Personalization
The hero copy now reads `?brand=` from the URL and personalizes the supporting brand line when a brand name is available.

- A valid `?brand=` value updates the `tw_brand` cookie
- If `brand` is missing, the page falls back to `tw_brand` when present
- Blank `brand` values do not overwrite the cookie
- If both the URL and cookie have values, the URL wins and the cookie is updated
- If a new `?brand=` value differs from the stored `tw_brand`, the page clears the saved parameter cookies for `geo`, `cohort`, `msp`, `headless`, `brand`, `package`, `hasConversion`, and `hasRetention` first so the new brand starts from a clean state before any fresh query params are applied
- The main hero headline stays fixed as `Welcome to Triple Whale!`, and the brand now appears in a smaller supporting line when available

## Geo Recommendation Persistence
The recommended region highlight now uses `geo` from the URL first and falls back to a cookie on later visits.

- A valid `?geo=` value updates the `tw_geo` cookie
- If there is no valid `geo` query param, the page falls back to `tw_geo`
- If both the URL and cookie have values, the URL wins and the cookie is updated
# tw-onboarding-router
# tw-onboarding-router
