function firstNonEmpty(values = []) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return ''
}

export function resolveRestaurantImage(entity) {
  if (!entity) return ''

  return firstNonEmpty([
    entity.imageWebp,
    entity.image,
    entity.restaurantImage,
    entity.logoWebp,
    entity.logo,
    entity.restaurantLogo,
    entity.imageAvif,
    entity.logoAvif
  ])
}

export function resolveLogoImage(entity) {
  if (!entity) return ''

  return firstNonEmpty([
    entity.logoWebp,
    entity.logo,
    entity.restaurantLogo,
    entity.imageWebp,
    entity.image,
    entity.restaurantImage,
    entity.logoAvif,
    entity.imageAvif
  ])
}

export function resolveGenericImage(...values) {
  return firstNonEmpty(values)
}
