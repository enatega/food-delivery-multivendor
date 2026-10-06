// Holds product data that list cards already have, so ProductDetails and its
// similar products section can render immediately while their queries are in flight.
const MAX_ENTRIES = 50
const MAX_PER_CATEGORY = 20
const previews = new Map()
const productsByCategory = new Map()

const getId = (product) => {
  const id = product?.id ?? product?._id
  return id ? String(id) : null
}

export const setProductPreview = (product) => {
  const key = getId(product)
  if (!key) return
  previews.delete(key)
  previews.set(key, product)
  if (previews.size > MAX_ENTRIES) previews.delete(previews.keys().next().value)
}

export const getProductPreview = (id) => (id ? previews.get(String(id)) : undefined)

// Called by every rendered product card, so each category accumulates the products already shown.
export const rememberCategoryProduct = (product) => {
  const key = getId(product)
  const categoryId = product?.categoryId ? String(product.categoryId) : null
  if (!key || !categoryId) return
  let products = productsByCategory.get(categoryId)
  if (!products) {
    products = new Map()
    productsByCategory.set(categoryId, products)
  }
  products.set(key, product)
  if (products.size > MAX_PER_CATEGORY) products.delete(products.keys().next().value)
}

export const getCategoryProducts = (categoryId, excludeId) => {
  const products = categoryId ? productsByCategory.get(String(categoryId)) : null
  if (!products) return []
  return [...products.values()].filter((product) => getId(product) !== String(excludeId))
}
