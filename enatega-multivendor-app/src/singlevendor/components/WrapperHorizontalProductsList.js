import React, { useState } from 'react'
import HorizontalProductsList from './HorizontalProductsList'
import useHomeProducts from '../screens/Home/useHomeProducts'
import SearchModal from './ProductExplorer/SearchModal'

const WrapperHorizontalProductsList = ({ data = [], listTitle = '' }) => {
  const { loading, data: productsData } = useHomeProducts({ categoryId: data?.id })
  const products = productsData?.getCategoryItemsSingleVendor.items
  const [searchVisible, setSearchVisible] = useState(false)

  return (
    <>
      <HorizontalProductsList listTitle={listTitle} viewType={data.viewType} ListData={products} isLoading={loading} setSearchVisible={setSearchVisible} />
      <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} items={products} />
    </>
  )
}

export default WrapperHorizontalProductsList
