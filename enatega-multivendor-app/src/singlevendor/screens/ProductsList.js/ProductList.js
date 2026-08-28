import { View, Text } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import screenOptions from './screenOptions'
import ProductsList from '../../components/ProductExplorer/ProductsList'
import useHomeProducts from '../Home/useHomeProducts'
import SectionListSkeleton from '../../components/SectionListSkeleton'

const ProductList = ({  }) => {
    const route = useRoute()
    const { categoryId } = route?.params

    console.log("category id",categoryId)
    
    const navigation = useNavigation()
    const currentTheme = useContext(ThemeContext)
    useLayoutEffect(() => {
        navigation.setOptions(
          screenOptions({
            backColor: currentTheme.themeBackground,
            fontColor: currentTheme.newFontcolor,
            iconColor: currentTheme.newIconColor,
            currentTheme: currentTheme,
            navigation: navigation,
            headerRight: null
          })
        )
      }, [navigation])

      const { loading, data: productsData } = useHomeProducts({ categoryId: categoryId })
      const products = productsData?.getCategoryItemsSingleVendor.items
      if (loading) {
        return <SectionListSkeleton title=''/>
      }

  return (
    <ProductsList
        categoryId={categoryId}
        onClose={() => navigation.goBack()  }
        isPaginated={true}
        items={products}
        
    />
  )
}

export default ProductList