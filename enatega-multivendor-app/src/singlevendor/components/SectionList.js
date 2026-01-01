import { View, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useMemo, useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'
import LoadingSkeleton from './LoadingSkeleton'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Button from '../../components/Button/Button'
import { scale, verticalScale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'

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
    return (
      <View style={styles(currentTheme).container}>
        <SectionHeader title={title} showSeeAll={false} />
        <View style={styles(currentTheme).listContent}>
          <View style={styles(currentTheme).row}>
            <View style={styles(currentTheme).productCard}>
              <LoadingSkeleton height={200} width="100%" borderRadius={12} />
              <View style={styles(currentTheme).skeletonSpacing}>
                <LoadingSkeleton height={16} width="80%" borderRadius={4} />
                <LoadingSkeleton height={16} width="60%" borderRadius={4} />
                <LoadingSkeleton height={20} width="50%" borderRadius={4} />
              </View>
            </View>
            <View style={styles(currentTheme).productCard}>
              <LoadingSkeleton height={200} width="100%" borderRadius={12} />
              <View style={styles(currentTheme).skeletonSpacing}>
                <LoadingSkeleton height={16} width="80%" borderRadius={4} />
                <LoadingSkeleton height={16} width="60%" borderRadius={4} />
                <LoadingSkeleton height={20} width="50%" borderRadius={4} />
              </View>
            </View>
          </View>
          <View style={styles(currentTheme).row}>
            <View style={styles(currentTheme).productCard}>
              <LoadingSkeleton height={200} width="100%" borderRadius={12} />
              <View style={styles(currentTheme).skeletonSpacing}>
                <LoadingSkeleton height={16} width="80%" borderRadius={4} />
                <LoadingSkeleton height={16} width="60%" borderRadius={4} />
                <LoadingSkeleton height={20} width="50%" borderRadius={4} />
              </View>
            </View>
            <View style={styles(currentTheme).productCard}>
              <LoadingSkeleton height={200} width="100%" borderRadius={12} />
              <View style={styles(currentTheme).skeletonSpacing}>
                <LoadingSkeleton height={16} width="80%" borderRadius={4} />
                <LoadingSkeleton height={16} width="60%" borderRadius={4} />
                <LoadingSkeleton height={20} width="50%" borderRadius={4} />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles(currentTheme).container}>
        <SectionHeader title={title} showSeeAll={false} />
        <View style={styles(currentTheme).errorContainer}>
          <MaterialIcons 
            name="error-outline" 
            size={48} 
            color={currentTheme.textErrorColor} 
          />
          <TextDefault style={styles(currentTheme).errorText}>
            {/* {error?.message || 'Failed to load data'} */}
            “Oops! We couldn’t load the data. Tap ‘Retry’ to try again.”
          </TextDefault>
          {onRetry && (
            <Button
              text="Retry"
              buttonStyles={styles(currentTheme).retryButton}
              textStyles={styles(currentTheme).retryButtonText}
              buttonProps={{ onPress: onRetry }}
            />
          )}
        </View>
      </View>
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
    },
    skeletonSpacing: {
      marginTop: scale(8),
      gap: scale(6)
    },
    errorContainer: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      paddingVertical: verticalScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.errorInputBack,
      borderRadius: scale(12),
      ...alignment.MLlarge,
      ...alignment.MRlarge,
      ...alignment.MTsmall,
      borderWidth: 1,
      borderColor: currentTheme.errorInputBorder
    },
    errorText: {
      marginTop: scale(16),
      ...textStyles.H5,
      color: currentTheme.textErrorColor,
      ...textStyles.Center,
      ...alignment.MBlarge
    },
    retryButton: {
      backgroundColor: currentTheme.textErrorColor,
      paddingHorizontal: scale(24),
      paddingVertical: scale(12),
      borderRadius: scale(8),
      ...alignment.MTxSmall
    },
    retryButtonText: {
      color: currentTheme.white,
      ...textStyles.H5,
      fontWeight: '600'
    }
  })

export default SectionList

