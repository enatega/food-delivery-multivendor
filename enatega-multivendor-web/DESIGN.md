---
name: "Enatega Quiet Orbit"
description: "An elegant everyday-delivery system shaped by a pure-white landing canvas, precise type, alpha product still lifes, and brand-green route geometry."
colors:
  primary: "#75d04b"
  primary-light: "#f3ffee"
  primary-dark: "#5ac12f"
  primary-hover: "#68c73e"
  primary-pressed: "#56b02f"
  primary-focus: "rgba(117, 208, 75, 0.32)"
  primary-disabled: "#b9e8a3"
  warm-ivory: "#f7f6f0"
  white-surface: "#ffffff"
  pale-map: "#f8f7f3"
  charcoal-ink: "#151914"
  muted-ink: "#62685f"
  hairline: "#e8e9e4"
  pale-sage-plinth: "#e5ecda"
  dark-ground: "#111410"
  dark-surface: "#181c17"
  dark-map: "#20251f"
  dark-ink: "#f7f8f3"
  dark-muted: "#b6bcb2"
  dark-hairline: "#343a32"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 5.5vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  editorial:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "inherit"
    fontWeight: 500
    lineHeight: 0.92
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.16em"
rounded:
  control: "12px"
  search: "14px"
  panel: "16px"
  orbit: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.control}"
  button-green:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white-surface}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  input-city:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.search}"
    padding: "16px 20px"
    height: "64px"
  orbit-preview:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.orbit}"
    size: "128px"
---

# Design System: Enatega Quiet Orbit

## Overview

**Creative North Star: "Quiet Orbit"**

Quiet Orbit makes Enatega feel like one elegant everyday-delivery system. The multivendor root uses a pure-white canvas; charcoal carries information; pale sage grounds product objects; brand green appears as a route signal, active state, or decisive action. Editorial italic phrases add humanity without turning the interface into a magazine pastiche.

The system is spacious, precise, and product-led. Alpha-validated isolated still lifes, autonomous orbit markers, fine route drawings, and hairline rules explain movement without ornamental chrome. The multivendor root landing page is the fullest expression of this world: it owns the city gateway, product orbit, restored More than delivery strip, and Choose–Moving–Arrived scroll story. Those compositions are route-specific and must not be copied into discovery or other transactional screens.

**Key Characteristics:**

- A pure-white root canvas with charcoal contrast and pale-sage support.
- One purposeful green route language, never a wash of decorative accent color.
- Inter for clarity, with Cormorant Garamond italic reserved for short emotional accents.
- Real isolated product imagery on generous negative space; no people or invented marketplace listings on the root landing surface.
- Code-native SVG and CSS geometry, restrained shadows, and low-amplitude motion.

## Colors

The palette is a quiet neutral field punctuated by Enatega green; light and dark tokens preserve the same hierarchy rather than changing the brand character.

### Primary

- **Route Green:** The core Enatega signal for key actions, route strokes, progress, indices, and small accents.
- **Deep Route Green:** The stronger accessible green for linework, active tabs, editorial accents, and hover states.
- **Soft Route Tint:** A pale sage-green surface for selected rows, orbit previews, and gradual section transitions.

### Neutral

- **Warm Ivory:** The shared application ground outside the root-only Quiet Orbit override.
- **White Surface:** The pure-white multivendor landing canvas and its control surfaces.
- **Charcoal Ink:** Primary text, dark action fills, and partnership bands.
- **Muted Ink:** Supporting copy, labels, and inactive states.
- **Hairline:** Dividers, orbit guides, input rings, and route tracks.
- **Pale Sage Plinth:** The grounding ellipse beneath isolated product objects.
- **Dark Ground / Surface / Map:** Dark-theme tonal layers; preserve their green-black cast instead of substituting neutral gray.

### Named Rules

**The Route Signal Rule.** Green denotes movement, progress, selection, or action. Keep it concentrated enough that every green mark feels operational.

**The Pure Canvas Rule.** The multivendor Quiet Orbit landing uses pure white for both page ground and controls, separated by hairlines and restrained shadow; charcoal remains a deliberate high-contrast field.

## Typography

**Display Font:** Inter (with system sans-serif fallback)  
**Body Font:** Inter (with system sans-serif fallback)  
**Editorial Accent Font:** Cormorant Garamond italic (with Georgia fallback)

**Character:** Inter gives the system an exact, contemporary voice with compact tracking and moderate weight. Cormorant Garamond supplies one graceful tonal shift inside large headlines; it is an accent, not a second reading face.

### Hierarchy

- **Display:** Medium-weight, tightly tracked, nearly solid leading; used for the root hero statement.
- **Headline:** A slightly smaller version of the same Inter construction for major narrative sections.
- **Editorial Accent:** Medium italic at the surrounding display size; one short phrase per headline.
- **Body:** Regular Inter with open leading and a practical 38–52 character measure on landing copy.
- **Label:** Semibold uppercase Inter with wide tracking for eyebrows, stage titles, and numbered product annotations.

### Named Rules

**The One Italic Phrase Rule.** Use the editorial serif for one brief emotional phrase inside a major headline, never for paragraphs, controls, or multiple competing fragments.

## Layout

The reusable shell uses a centered maximum width of 1720px. Horizontal padding grows from 24px on small screens to 32px, 48px, and 64px across the shipped breakpoints. Hairlines divide major regions; whitespace does most of the grouping.

The multivendor root hero uses a 43/57 text-to-visual split on large screens and stacks on smaller screens. The restored More than delivery strip follows it as a shallow three-part bridge for customer, business, and rider paths, joined by one green route line on large screens. The route story becomes a 300svh pinned sequence from the medium breakpoint upward and a natural vertical sequence on mobile. These ratios, the strip, and the pinned journey belong to `/`; other screens should inherit the spacing, type, color, and control language without copying the landing composition.

RTL is structural: border sides, directional icons, annotation anchors, and transform origins reverse deliberately. Minimum interactive height is 44–48px; the primary city search field is 64px high.

## Elevation & Depth

Quiet Orbit is flat by default. Depth appears only where an object or control must float above the white field: city search, suggestion menu, orbit previews, and product still lifes. Pale-sage elliptical plinths provide most object grounding; shadows remain diffuse and low contrast.

### Shadow Vocabulary

- **Control Float** (`0 18px 42px rgba(21, 25, 20, 0.12)`): City search and circular product previews.
- **Overlay** (`0 24px 64px rgba(21, 25, 20, 0.18)`): Suggestion menus and true overlays.
- **Object Contact** (`0 24px 28px rgba(21, 25, 20, 0.16)` to `0 26px 30px rgba(21, 25, 20, 0.17)`): Transparent product cutouts only.

### Named Rules

**The Grounded Object Rule.** Use a soft plinth plus one contact shadow for product still lifes. Do not turn ordinary content sections into floating cards.

## Shapes

Controls use gently rounded 12–14px corners; larger panels may reach 16px. Fully circular geometry is reserved for orbit previews, progress nodes, icon controls, and the broad elliptical product plinth. Fine 1–2px rules and rounded SVG route caps keep the system precise without feeling mechanical.

The signature silhouette is the orbit or route: a single continuous green path paired with a neutral guide. It should describe selection or movement, not become background decoration.

## Components

### Buttons

- **Shape:** Compact and decisive with 12px corners and a minimum 48px height.
- **Primary:** Route green with charcoal text for the city-search action; it shifts to the established green hover token and remains visibly green while disabled.
- **Green:** Route green with charcoal text for the rider partnership action and similarly decisive positive actions.
- **Outline:** Transparent on charcoal with a deep-green border; fill it green on hover.
- **Focus:** Use the global three-pixel translucent green outline with a three-pixel offset. Disabled actions use the hairline and muted-ink tokens rather than lowering contrast unpredictably.

### Tabs

- **Style:** Text-only category labels on a hairline baseline. The active tab receives a two-pixel deep-green underline; inactive tabs remain muted.
- **Behavior:** The underline grows from the logical start edge over 300ms and reverses its transform origin in RTL.

### Cards / Containers

- **Corner Style:** Quiet Orbit avoids generic card grids. When containment is necessary, use 14–16px corners.
- **Background:** The root Quiet Orbit surface stays pure white; shared application containers may use white or pale-map on the existing warm-ivory ground. Charcoal is reserved for strong terminal bands.
- **Shadow Strategy:** Flat unless the element is a control, overlay, or isolated object.
- **Border:** One-pixel hairlines instead of heavy outlines.

### Inputs / Fields

- **Style:** The landing city field is a white, 64px-high search control with a 14px radius, hairline ring, map-pin cue, and adjacent location/action cluster.
- **Focus:** Preserve the global visible focus treatment and deep-green caret.
- **Suggestions:** Use a matching raised surface, 14px corners, an overlay shadow, keyboard-active tint, and at least 48px row height.

### Navigation

The shared header stays a 72px white surface with a hairline lower edge. On the multivendor root only, hide the redundant header address and discovery search, center the vendor-mode toggle, and retain logo, theme, language, account, and cart behavior. All other routes keep their existing location and search behavior unchanged.

### Product Orbit (root landing only)

The hero pairs one large isolated product still life with two circular previews and one code-native oval route loop. Three green markers travel autonomously around that loop on a 10.8-second cycle, phase-shifted by 3.6 seconds. Selecting Food, Groceries, or Essentials crossfades the object with a small vertical shift while the orbit continues independently. Reduced motion removes the traveling markers and resolves category changes immediately.

### More than Delivery Strip (root landing only)

The restored strip bridges hero and journey with one concise title and three equal customer, business, and rider paths. On large screens a two-pixel green route rises from the hero edge and runs through three outlined nodes; mobile uses simple hairline-separated rows without decorative motion.

### Delivery Journey (root landing only)

The desktop section pins while a single SVG route progresses through Choose, Moving, and Arrived. The delivery bag moves only a few pixels and rotates by two degrees; copy fades rather than flies. Mobile uses a static, naturally scrolling narrative. Reduced motion shows the complete route and final stage with no staged animation.

## Do's and Don'ts

### Do:

- **Do** use pure white, charcoal, and pale sage as the root landing field around concentrated route-green signals.
- **Do** use the regenerated, alpha-validated product still lifes with their per-asset metadata and aggregate provenance record; preserve transparent backgrounds and restrained contact shadows.
- **Do** keep route geometry code-native in SVG/CSS, logical-direction aware, and meaningful to selection or progress.
- **Do** preserve the shipped dark tokens, keyboard focus, reduced-motion behavior, localization, and RTL mirroring.
- **Do** keep the multivendor root focused on city selection and system understanding, then send actual marketplace discovery to `/discovery`.

### Don't:

- **Don't** duplicate restaurant, store, offer, or product-listing discovery content on the multivendor root landing page.
- **Don't** add people, lifestyle scenes, decorative gradients, glass effects, or a grid of generic rounded marketing cards to Quiet Orbit.
- **Don't** use the editorial serif for body copy, controls, navigation, or more than one accent phrase in a major headline.
- **Don't** copy the product orbit, pinned route story, or root-only hidden header controls onto non-root screens.
- **Don't** amplify motion beyond the shipped small fades, route draws, slight scale changes, and low-amplitude object movement.
