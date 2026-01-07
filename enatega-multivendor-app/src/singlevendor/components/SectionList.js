import { View, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useCallback } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'
import SectionListSkeleton from './SectionListSkeleton'
import SectionListError from './SectionListError'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'

const SectionList = ({ title = 'Limited time deals', data = [], loading = false, error = null, onRetry = null }) => {
  console.log('data of the section list',JSON.stringify(data,null,2));
  
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const navigation = useNavigation()
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const handleAddToCart = useCallback((product) => {
    // Handle add to cart action
    console.log('Add to cart:', product?.title)
  }, [])

  const onProductPress = useCallback((id) => {
    navigation.navigate('ProductDetails', {
      productId: id
    })
  }, [navigation])

  const renderProduct = useCallback(({ item, index }) => {
    console.log('item of the product card',item);
    return (
      <ProductCard
        product={item}
        onAddToCart={handleAddToCart}
        onCardPress={onProductPress}
        containerStyles={[
          styles(currentTheme).productCard,
          index % 2 === 0 ? styles(currentTheme).leftCard : styles(currentTheme).rightCard
        ]}
      />
    )
  }, [currentTheme, handleAddToCart, onProductPress])

  const keyExtractor = useCallback((item) => {
    return item?.id?.toString() || Math.random().toString()
  }, [])

  if (loading) {
    return <SectionListSkeleton title={title} />
  }

  if (error) {
    return (
      <SectionListError 
        title={title}
        errorMessage="Oops! We couldn't load the data. Tap 'Retry' to try again."
        onRetry={onRetry}
      />
    )
  }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={title} showSeeAll={false} />
      <FlatList
        data={data || []}
        numColumns={2}
        keyExtractor={keyExtractor}
        renderItem={renderProduct}
        contentContainerStyle={styles(currentTheme).listContent}
        columnWrapperStyle={styles(currentTheme).row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      ...alignment.MTlarge,
      ...alignment.MBsmall
    },
    listContent: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      ...alignment.PBsmall
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scale(16)
    },
    productCard: {
      width: '48%',
      marginRight: 0
    },
    leftCard: {
      marginRight: '2%'
    },
    rightCard: {
      marginLeft: 0
    }
  })

export default SectionList

