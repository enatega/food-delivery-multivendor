import React, { useState } from 'react'
import HorizontalProductsList from './HorizontalProductsList'
import useHomeProducts from '../screens/Home/useHomeProducts'
import WrapperSearchModal from './ProductExplorer/WrapperSearchModal'
import SectionListError from './SectionListError'

const WrapperHorizontalProductsList = ({ data = null, listTitle = '' }) => {
  const { loading, data: productsData, error, refetch } = useHomeProducts({ categoryId: data?.id })
  const products = productsData?.getCategoryItemsSingleVendor?.items
  const [searchVisible, setSearchVisible] = useState(false)

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
