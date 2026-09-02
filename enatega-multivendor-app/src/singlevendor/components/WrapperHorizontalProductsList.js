import React, { useState } from 'react'
import HorizontalProductsList from './HorizontalProductsList'
import useHomeProducts from '../screens/Home/useHomeProducts'
import WrapperSearchModal from './ProductExplorer/WrapperSearchModal'
import SectionListError from './SectionListError'

const WrapperHorizontalProductsList = ({ data = null, listTitle = '' }) => {
  const hasPreview = Array.isArray(data?.items)
  const { loading, data: productsData, error, refetch } = useHomeProducts({
    categoryId: data?.id,
    skipQuery: hasPreview
  })
  const products = hasPreview
    ? data.items
    : productsData?.getCategoryItemsSingleVendor?.items
  const [searchVisible, setSearchVisible] = useState(false)

  const hasNoProducts = Array.isArray(products)
    ? products.length === 0
    : !loading

  if (!error && hasNoProducts) {
    return null
  }

  return (
    <>
      {error
        ? <SectionListError title={listTitle} onRetry={refetch} />
        : <HorizontalProductsList categoryId={data?.id} listTitle={listTitle} viewType={data?.viewType} ListData={products} isLoading={loading} setSearchVisible={setSearchVisible} />}
      <WrapperSearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} items={products} categoryId={data?.id} />
    </>
  )
}

export default WrapperHorizontalProductsList
