# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Enatega serves people ordering food, groceries, and other local goods for delivery or pickup. They typically arrive with a location and an immediate need to discover what is available, compare options, place an order, and track it. The same customer website can operate as a neighborhood multivendor marketplace or as a focused single-vendor storefront.

Secondary audiences use the public marketing surfaces to evaluate becoming a restaurant, store, or rider partner.

## Product Purpose

Turn a customer's location into an actionable local marketplace, carry them from discovery through checkout and tracking, and support the complete account and post-purchase journey. Success means customers can quickly understand what is available, trust the ordering information, and complete an order without mode or navigation confusion.

## Positioning

Enatega provides one adaptable customer experience for two distinct operating models: a multivendor neighborhood marketplace spanning restaurants and stores, and a single-vendor catalog with deals, categories, and direct ordering. Mode-specific carts and active orders remain isolated while customers can move safely between services.

## Operating Context

Customers browse by current or saved delivery address, search nearby vendors or products, compare ratings and delivery information, customize items, manage carts, select delivery or pickup, pay, and follow live order progress. The web app supports responsive mobile and desktop usage, light and dark themes, multiple languages, RTL layouts, PWA behavior, and location/map integrations.

## Capabilities and Constraints

- Next.js App Router, React, Tailwind CSS, PrimeReact, Apollo GraphQL, next-intl, Google Maps, Stripe, Firebase, and PWA/service-worker integration are established constraints.
- Preserve existing GraphQL contracts, route compatibility, authentication, payment, cart, order, tracking, localization, and business behavior unless a change is explicitly part of the redesign.
- Multivendor `/` is an ordering-first marketplace entry page.
- Single-vendor `/` resolves to `/discovery`, which is its default home surface.
- Mode switching must preserve isolated carts and active orders and continue to guard incompatible routes.
- Factual commercial claims must be verified; the redesign must not invent testimonials, coverage, prices, performance statistics, or partner outcomes.
- Every user-visible label, location, vendor, product, price, ETA, offer, image, and claim must resolve from the existing translation, configuration, or API data paths. Do not introduce hardcoded production content or sample marketplace data. New interface labels, when unavoidable, must be localized through the existing locale system rather than written inline in components.

## Brand Commitments

- Preserve the Enatega name and existing logo.
- Preserve the current primary green family: `#75D04B` primary, `#F3FFEE` light, `#5AC12F` dark, plus the established hover, pressed, focus, and disabled states.
- The shipped visual direction is **Quiet Orbit**: an elegant pure-white multivendor landing canvas with precise Inter typography, restrained Cormorant Garamond italic accents, brand-green route geometry, pale-sage grounding fields, and address-first interaction.
- The result must avoid generic AI/SaaS styling, interchangeable food-delivery templates, gratuitous glass effects, excessive rounded cards, decorative gradients, and ungrounded marketing copy.
- New surface development is comp-first: high-fidelity desktop and mobile compositions are approved before production UI code.
- The approved multivendor root composition uses one city gateway with a green landing action, an isolated food-grocery-essentials product orbit with autonomous oval route markers, the restored More than delivery customer-business-rider strip, a low-amplitude Choose–Moving–Arrived scroll journey, and a final branch to restaurant or rider partnership. It intentionally sends marketplace listings to discovery instead of duplicating them on `/`.

## Evidence on Hand

- Existing logos and product imagery live under `public/assets/` and `lib/assets/`; the regenerated Quiet Orbit still lifes, per-asset generation metadata, and aggregate provenance live under `public/assets/images/landing/quiet-orbit/`. Their transparent alpha was validated before the final WebP encoding.
- Real vendor, product, category, banner, rating, delivery, and order data is supplied by the existing GraphQL APIs.
- The current implementation demonstrates the complete route set and product behavior but is visual evidence and an anti-reference rather than authority for the replacement design.
- Existing promotional percentage, zero-fee, and superlative claims require product-owner verification before reuse.

## Product Principles

- Location and availability come before promotion.
- Make the two operating modes distinct in task hierarchy but unmistakably one Enatega product.
- Show real marketplace information and state instead of generic claims or decorative chrome.
- Keep ordering fast on mobile while using desktop space for comparison and context.
- Accessibility, localization, RTL behavior, resilience, and honest system states are part of the design, not finishing work.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Support keyboard navigation, visible focus, semantic landmarks, accessible dialogs and drawers, adequate contrast, reduced motion, touch targets, responsive zoom, long translations, RTL layouts, and screen-reader labels for all icon-only controls.
