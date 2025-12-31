import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo, useCallback } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'
import LoadingSkeleton from './LoadingSkeleton'

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
          <Text style={styles(currentTheme).errorText}>
            {error?.message || 'Failed to load data'}
          </Text>
          {onRetry && (
            <TouchableOpacity 
              style={styles(currentTheme).retryButton}
              onPress={onRetry}
            >
              <Text style={styles(currentTheme).retryButtonText}>
                Retry to get data
              </Text>
            </TouchableOpacity>
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
      marginTop: 20,
      marginBottom: 10
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16
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
      marginTop: 8,
      gap: 6
    },
    errorContainer: {
      paddingHorizontal: 20,
      paddingVertical: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.errorInputBack || '#F7E7E5',
      borderRadius: 12,
      marginHorizontal: 20,
      marginTop: 10,
      borderWidth: 1,
      borderColor: currentTheme.errorInputBorder || '#DB4A39'
    },
    errorText: {
      marginTop: 16,
      fontSize: 14,
      color: currentTheme.textErrorColor,
      textAlign: 'center',
      marginBottom: 20
    },
    retryButton: {
      backgroundColor: currentTheme.textErrorColor,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 8
    },
    retryButtonText: {
      color: currentTheme.white,
      fontSize: 14,
      fontWeight: '600'
    }
  })

export default SectionList

