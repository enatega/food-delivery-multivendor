import React, { useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { getDealLabel, getDealPricing } from '../../utils/helper'
import { isVariationOutOfStock } from '../../utils/stock'

const OptionList = ({ title, subtitle, list = [], isVariation = false, selectedIds = [], onChange, t }) => {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const themedStyles = styles(currentTheme)

  const onPressItem = (id) => {
    if (isVariation) {
      // Radio selection
      onChange([id], id)
    } else {
      // Checkbox selection
      if (selectedIds.includes(id)) {
        onChange(
          selectedIds.filter((x) => x !== id),
          id
        )
      } else {
        onChange([...selectedIds, id], id)
      }
    }
  }

  const renderItem = ({ item }) => {
    const selected = selectedIds.includes(item.id)
    const pricing = getDealPricing(item.price, item.deal)
    const dealLabel = isVariation ? getDealLabel(item.deal, configuration?.currencySymbol) : null
    const hasDeal = isVariation && pricing.discountAmount > 0
    const isOutOfStock = isVariation && isVariationOutOfStock(item)

    return (
      <TouchableOpacity style={[themedStyles.row, isOutOfStock && themedStyles.outOfStockRow]} onPress={() => onPressItem(item.id)} activeOpacity={0.7}>
        {/* Radio / Checkbox */}
        <View style={[themedStyles.selector, selected && themedStyles.selected]}>
          {isVariation && selected && <View style={themedStyles.innerDot} />}
          {!isVariation && selected && <Text style={themedStyles.check}>✓</Text>}
        </View>

        {/* Title */}
        <View style={themedStyles.textContainer}>
          <Text style={themedStyles.title}>{item.title}</Text>
          {isOutOfStock && <Text style={themedStyles.outOfStockText}>{t?.('out_of_stock_label', { defaultValue: 'Out of stock' })}</Text>}
          {item.isPopular && <Text style={themedStyles.badge}>{t?.('Popular') || 'Popular'}</Text>}
        </View>

        {/* Price */}
        {item.price !== undefined && (
          <View style={themedStyles.priceBlock}>
            {dealLabel && <Text style={themedStyles.dealLabel}>{dealLabel}</Text>}
            <Text style={[themedStyles.price, hasDeal && themedStyles.dealPrice]}>
              {hasDeal ? pricing.finalPrice : item.price} {configuration?.currencySymbol}
            </Text>
            {hasDeal && (
              <Text style={themedStyles.originalPrice}>
                {item.price} {configuration?.currencySymbol}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerTitle}>{title}</Text>
        {subtitle && <Text style={themedStyles.subtitle}>{subtitle}</Text>}
      </View>

      <FlatList data={list} keyExtractor={(item) => item.id} renderItem={renderItem} scrollEnabled={false} />
    </View>
  )
}

export default OptionList

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      marginVertical: 0,
      paddingHorizontal: 15
    },
    header: {
      marginBottom: 8
    },
    headerTitle: {
      color: currentTheme.fontMainColor,
      fontSize: 18,
      fontWeight: '600'
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: currentTheme.secondaryText,
      marginTop: 12
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6
    },
    outOfStockRow: {
      opacity: 0.6
    },
    outOfStockText: {
      color: currentTheme.errorColor || '#DC2626',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 2
    },
    selector: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: currentTheme.secondaryText,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
    },
    selected: {
      borderColor: currentTheme.singleVendorBrand
    },
    innerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: currentTheme.singleVendorBrand
    },
    check: {
      color: currentTheme.singleVendorBrandForeground,
      fontSize: 14,
      fontWeight: '700'
    },
    textContainer: {
      flex: 1
    },
    title: {
      color: currentTheme.fontMainColor,
      fontSize: 15,
      fontWeight: '500'
    },
    badge: {
      fontSize: 12,
      color: currentTheme.singleVendorBrandForeground,
      marginTop: 2
    },
    price: {
      color: currentTheme.fontMainColor,
      fontWeight: '600'
    },
    priceBlock: {
      alignItems: 'flex-end',
      gap: 2
    },
    dealPrice: {
      color: currentTheme.singleVendorBrandForeground
    },
    originalPrice: {
      color: currentTheme.fontSecondColor,
      fontSize: 12,
      textDecorationLine: 'line-through'
    },
    dealLabel: {
      backgroundColor: currentTheme.singleVendorBrand,
      borderRadius: 5,
      color: currentTheme.singleVendorOnBrand,
      fontSize: 10,
      fontWeight: '700',
      overflow: 'hidden',
      paddingHorizontal: 6,
      paddingVertical: 3
    }
  })
