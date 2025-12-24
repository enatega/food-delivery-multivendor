import { View, StyleSheet } from 'react-native'
import React from 'react'
import HorizontalProductsList from './HorizontalProductsList'
import useHomeProducts from '../screens/Home/useHomeProducts'
import LoadingSkeleton from './LoadingSkeleton'

const WrapperHorizontalProductsList = ({ data = [], listTitle = '' }) => {
  const { loading, data: productsData } = useHomeProducts({ categoryId: data?.id })
  const products = productsData?.getCategoryItemsSingleVendor.items

  return <HorizontalProductsList listTitle={listTitle} ListData={products} isLoading={loading} />
}

const styles = () =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 20,
      paddingRight: 10
    }
  })

export default WrapperHorizontalProductsList
