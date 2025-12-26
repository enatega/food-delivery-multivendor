import { View, Text } from 'react-native'
import React from 'react'
import LoadingSkeleton from '../LoadingSkeleton'

const ProductDetailsLoader = () => {
  return (
    <View style={{ gap: 10 }}>
      <LoadingSkeleton height={200} width='100%' borderRadius={20} />
      <View style={{ paddingHorizontal: 15, gap: 10 }}>
        <LoadingSkeleton height={70} width='100%' />
        <LoadingSkeleton height={300} width='100%' borderRadius={20} />
      </View>
    </View>
  )
}

export default ProductDetailsLoader
