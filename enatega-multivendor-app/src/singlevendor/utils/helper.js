import useVendorModeStore from '../stores/useVendorModeStore'

export const isSingleVendor = () => {
  const { vendorMode } = useVendorModeStore.getState()
  console.log('Vendor Mode:', vendorMode)
    return vendorMode === 'SINGLE'
}


export const normalizeCatalogData = (apiData) => {
  const categories = [];
  const products = [];
  const categoryIndexMap = {};

  let runningIndex = 0;

  apiData.forEach(category => {
    const {
      categoryId,
      categoryName,
      items = [],
    } = category;

    // 1️⃣ Subcategory list (horizontal)
    categories.push({
      id: categoryId,
      title: categoryName,
    });

    // 2️⃣ Map first product index for scroll syncing
    if (items.length > 0) {
      categoryIndexMap[categoryId] = runningIndex;
    }

    // 3️⃣ Flatten products
    items.forEach(item => {
      products.push({
        ...item,
        categoryId,
        categoryName,
      });
      runningIndex += 1;
    });
  });

  return {
    categories,
    products,
    categoryIndexMap,
  };
};
