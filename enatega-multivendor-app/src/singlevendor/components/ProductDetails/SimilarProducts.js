import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HorizontalProductsList from '../HorizontalProductsList'
import useGetSimilarFoods from '../../screens/ProductDetails/useGetSimilarFoods'

const SimilarProducts = ({ id }) => {
  const { data, loading } = useGetSimilarFoods({ foodId: id })

  return <HorizontalProductsList showSeeAll={false} listTitle='Similar products' ListData={data?.getSimilarFoods?.items} isLoading={loading} />
}

export default SimilarProducts

const styles = StyleSheet.create({})
