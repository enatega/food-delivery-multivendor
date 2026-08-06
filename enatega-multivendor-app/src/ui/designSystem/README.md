# Multivendor visual foundation

This module is the semantic visual layer for the multivendor customer app. It
does not replace or mutate the legacy theme object, so single-vendor screens
remain unchanged until they explicitly adopt a shared primitive.

## Layout rules

- Prefer typography and spacing over decorative containers.
- Use cards only for genuinely bounded objects; do not nest cards.
- Use `Divider` for separators. It is theme-aware and always hairline width.
- Use the semantic `surface*`, `text*`, and `border*` colors instead of legacy
  gray or horizontal-line tokens.
- Keep the mode accent for actions, focus, and selection—not large backgrounds.

## Compact horizontal rails

Category, cuisine, shop-type, and other small image tiles follow the shared
single-vendor proportions:

- `tokens.sizes.compactTile` for an 80 × 80 image tile.
- `tokens.radii.tile` for the 12-point image radius.
- `tokens.spacing.lg` for the 16-point gap between tiles.
- Medium-weight, centered labels below the image, limited to two lines.
- One leading screen inset on the list content; do not wrap the horizontal
  list in a padded container, so it can scroll edge to edge.

Product cards and restaurant cards are not compact tiles and should retain the
dimensions appropriate to their content.

## Safe-area contract

`ScreenHeader` owns the top safe-area inset by default. `ScreenContainer`
therefore excludes the top edge by default and owns the side and bottom edges.

```jsx
<ScreenContainer>
  <ScreenHeader title={t('Screen title')} />
  <Content />
</ScreenContainer>
```

For a screen without `ScreenHeader`, opt the container into the top inset:

```jsx
<ScreenContainer includeTopInset>
  <Content />
</ScreenContainer>
```

Never wrap this combination in another top-safe-area view.

## Review rule

New multivendor UI must pass `npm run check:multivendor-design`. Existing
legacy violations are baseline-tracked and will be removed as each screen is
migrated; new violations fail the check immediately.
