import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
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

const SectionList = ({
  title = 'Limited time deals',
  data = [],
  loading = false,
  error = null,
  onRetry = null,
  hasMore = false,
  onLoadMore = null,
  loadingMore = false
}) => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const navigation = useNavigation()
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const handleAddToCart = useCallback((product) => {
    // Handle add to cart action
    console.log('Add to cart:', product?.title)
  }, [])

  const onProductPress = useCallback((id, categoryId) => {
    navigation.navigate('ProductDetails', {
      productId: id,
      categoryId: data?.[0]?.categoryId || categoryId // Pass categoryId from the first product if available, otherwise use the one from the pressed product
    })
  }, [data, navigation])

  const renderProduct = useCallback(({ item }) => {
    return (
      <ProductCard
        product={item}
        onAddToCart={handleAddToCart}
        onCardPress={onProductPress}
        layout='grid'
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
      {data?.length > 0
        ? (
          <FlatList
            data={data}
            numColumns={2}
            keyExtractor={keyExtractor}
            renderItem={renderProduct}
            contentContainerStyle={styles(currentTheme).listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={10}
            windowSize={10}
            ListFooterComponent={hasMore
              ? (
                <TouchableOpacity
                  accessibilityRole='button'
                  accessibilityLabel={t('loadMore', { defaultValue: 'Load more' })}
                  activeOpacity={0.8}
                  disabled={loadingMore}
                  onPress={onLoadMore}
                  style={styles(currentTheme).loadMoreButton}
                >
                  {loadingMore
                    ? <ActivityIndicator color={currentTheme.singleVendorOnBrand || '#10200A'} />
                    : (
                      <Text style={styles(currentTheme).loadMoreText}>
                        {t('loadMore', { defaultValue: 'Load more' })}
                      </Text>
                      )}
                </TouchableOpacity>
                )
              : null}
          />
          )
        : (
          <View
            accessible
            accessibilityRole='summary'
            style={styles(currentTheme).emptyState}
          >
            <View style={styles(currentTheme).emptyIconContainer}>
              <Ionicons
                name='pricetags-outline'
                size={scale(26)}
                color={currentTheme.singleVendorBrandForeground}
              />
            </View>
            <Text style={styles(currentTheme).emptyTitle}>
              {t('moreOffersOnTheWay', { defaultValue: 'More offers are on the way' })}
            </Text>
            <Text style={styles(currentTheme).emptyDescription}>
              {t('noDealsInSection', {
                defaultValue: `No ${String(title).toLowerCase()} are available right now. Check back soon for something worth discovering.`
              })}
            </Text>
          </View>
          )}
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
    loadMoreButton: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: currentTheme.singleVendorBrand || currentTheme.primary,
      borderRadius: scale(10),
      justifyContent: 'center',
      marginBottom: scale(8),
      minHeight: scale(42),
      minWidth: scale(132),
      paddingHorizontal: scale(20)
    },
    loadMoreText: {
      color: currentTheme.singleVendorOnBrand || '#10200A',
      fontSize: scale(14),
      fontWeight: '700'
    },
    emptyState: {
      alignItems: 'center',
      backgroundColor: currentTheme.cardBackground,
      borderColor: currentTheme.colorBorder,
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      marginBottom: scale(18),
      marginHorizontal: scale(20),
      paddingHorizontal: scale(24),
      paddingVertical: scale(24)
    },
    emptyIconContainer: {
      alignItems: 'center',
      backgroundColor: currentTheme.singleVendorBrandSubtle,
      borderRadius: scale(24),
      height: scale(48),
      justifyContent: 'center',
      marginBottom: scale(14),
      width: scale(48)
    },
    emptyTitle: {
      color: currentTheme.fontMainColor,
      fontSize: scale(16),
      fontWeight: '700',
      marginBottom: scale(7),
      textAlign: 'center'
    },
    emptyDescription: {
      color: currentTheme.colorTextMuted,
      fontSize: scale(13),
      lineHeight: scale(19),
      maxWidth: scale(290),
      textAlign: 'center'
    }
  })

export default SectionList
