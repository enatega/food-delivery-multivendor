import React, { useMemo } from 'react'
import HorizontalProductsList from '../HorizontalProductsList'
import useGetSimilarFoods from '../../screens/ProductDetails/useGetSimilarFoods'
import { getCategoryProducts } from '../../utils/productPreviewCache'

const SimilarProducts = ({ id, categoryId }) => {
  const { data, loading } = useGetSimilarFoods({ foodId: id })
  const items = data?.getSimilarFoods?.items

  // Until the server responds, show products from this category the user has already seen.
  const fallbackItems = useMemo(() => (items ? null : getCategoryProducts(categoryId, id)), [items, categoryId, id])
  const listData = items || fallbackItems
  const isLoading = loading && !fallbackItems?.length

  return <HorizontalProductsList showSeeAll={false} listTitle='Similar products' ListData={listData} isLoading={isLoading} />
}

export default SimilarProducts
