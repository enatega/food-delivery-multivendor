export const isVariationOutOfStock = (variation) =>
  Boolean(variation?.isOutOfStock ?? variation?.outofstock)

export const getFirstAvailableVariation = (variations = []) =>
  variations.find((variation) => !isVariationOutOfStock(variation))

export const isProductOutOfStock = (product) => {
  if (product?.isOutOfStock ?? product?.outofstock) return true

  const variations = Array.isArray(product?.variations) ? product.variations : []
  if (!variations.length) return true

  return !getFirstAvailableVariation(variations)
}
