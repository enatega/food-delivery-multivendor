import useVendorModeStore from '../stores/useVendorModeStore'

export const isSingleVendor = () => {
  const { vendorMode } = useVendorModeStore.getState()
  console.log('Vendor Mode:', vendorMode)
  return vendorMode === 'SINGLE'
}

export const normalizeCatalogData = (apiData) => {
  const categories = []
  const products = []
  const categoryIndexMap = {}

  let runningIndex = 0

  apiData.forEach((category) => {
    const { categoryId, categoryName, items = [] } = category

    // 1️⃣ Subcategory list (horizontal)
    categories.push({
      id: categoryId,
      title: categoryName
    })

    // 2️⃣ Map first product index for scroll syncing
    if (items.length > 0) {
      categoryIndexMap[categoryId] = runningIndex
    }

    // 3️⃣ Flatten products
    items.forEach((item) => {
      products.push({
        ...item,
        categoryId,
        categoryName
      })
      runningIndex += 1
    })
  })

  return {
    categories,
    products,
    categoryIndexMap
  }
}

export const getDealPricing = (price, deal) => {
  const parsedPrice = Number(price)
  const safePrice = Number.isFinite(parsedPrice) ? Math.max(parsedPrice, 0) : 0

  if (!deal || deal.isActive === false) return { finalPrice: safePrice, discountAmount: 0 }

  let discountAmount = 0
  const discountValue = Math.max(Number(deal.discountValue) || 0, 0)
  const discountType = String(deal.discountType || '').toUpperCase()

  if (discountType === 'FIXED') {
    discountAmount = discountValue
  } else if (discountType === 'PERCENTAGE') {
    discountAmount = (safePrice * discountValue) / 100
  }

  const appliedDiscount = Math.min(discountAmount, safePrice)
  const finalPrice = safePrice - appliedDiscount

  return {
    finalPrice: Number(finalPrice.toFixed(2)),
    discountAmount: Number(appliedDiscount.toFixed(2))
  }
}

export const getDealLabel = (deal, currencySymbol = '') => {
  if (!deal || deal.isActive === false) return null
  const value = Number(deal.discountValue)
  if (!Number.isFinite(value) || value <= 0) return null

  const type = String(deal.discountType || '').toUpperCase()
  if (type === 'PERCENTAGE') return `${value}% OFF`
  if (type === 'FIXED') return `${currencySymbol}${value} OFF`
  return null
}
