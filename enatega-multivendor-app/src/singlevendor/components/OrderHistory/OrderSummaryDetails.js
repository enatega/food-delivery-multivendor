import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const OrderSummaryDetails = ({
  orderNumber,
  deliveryAddress,
  itemSubtotal,
  deliveryFee,
  deliveryDistance,
  courierTip,
  total,
  currencySymbol = '€'
}) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const themedStyles = styles(currentTheme)

  return (
    <View style={themedStyles.container}>
      {/* Header */}
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={themedStyles.headerTitle}
        bolder
      >
        {t('Order summary') || 'Order summary'}
      </TextDefault>

      {/* Tax Note */}
      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={themedStyles.taxNote}
        bold
        
      >
        {t('incl. taxes (if applicable)') || 'incl. taxes (if applicable)'}
      </TextDefault>

      {/* Order Details Section */}
      <View style={themedStyles.detailsSection}>
        {/* Order Number */}
        {orderNumber && (
          <View style={themedStyles.detailRow}>
            <TextDefault
              textColor={currentTheme.colorTextMuted}
              style={themedStyles.detailLabel}
              bold
            >
              {t('Order number') || 'Order number'}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.colorTextMuted}
              style={themedStyles.detailValue}
              bold
            >
              {orderNumber}
            </TextDefault>
          </View>
        )}

        {/* Delivery Address */}
        {deliveryAddress && (
          <View style={themedStyles.detailRow}>
            <TextDefault
              textColor={currentTheme.colorTextMuted}
              style={themedStyles.detailLabel}
              bold
            >
              {t('Delivery address') || 'Delivery address'}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.colorTextMuted}
              style={themedStyles.detailValue}
              bold
              numberOfLines={0}
            >
              {deliveryAddress}
            </TextDefault>
          </View>
        )}

        {/* Item Subtotal */}
        <View style={themedStyles.detailRow}>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailLabel}
            bold
          >
            {t('Item subtotal') || 'Item subtotal'}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailValue}
            bold
          >
            {currencySymbol} {itemSubtotal.toFixed(2)}
          </TextDefault>
        </View>

        {/* Delivery */}
        <View style={themedStyles.detailRow}>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailLabel}
            bold
          >
            {t('Delivery') || 'Delivery'} {deliveryDistance ? `(${deliveryDistance})` : ''}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailValue}
            bold
          >
            {currencySymbol} {deliveryFee.toFixed(2)}
          </TextDefault>
        </View>

        {/* Courier Tip */}
        <View style={themedStyles.detailRow}>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailLabel}
            bold
          >
            {t('Courier tip') || 'Courier tip'}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={themedStyles.detailValue}
            bold
          >
            {currencySymbol} {courierTip.toFixed(2)}
          </TextDefault>
        </View>
      </View>

      {/* Separator */}
      <View style={themedStyles.separator} />

      {/* Total Amount Section */}
      <View style={themedStyles.totalRow}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={themedStyles.totalLabel}
          bolder
        >
          {t('Total amount') || 'Total amount'}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={themedStyles.totalValue}
          bolder
        >
          {currencySymbol} {total.toFixed(2)}
        </TextDefault>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingTop: verticalScale(4)
    },
    headerTitle: {
      fontSize: scale(18),
      fontWeight: '700',
      marginBottom: verticalScale(8)
    },
    taxNote: {
      fontSize: scale(14),
      marginBottom: verticalScale(16),
      fontWeight: '400'
    },
    detailsSection: {
      marginBottom: verticalScale(12)
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: verticalScale(12)
    },
    detailLabel: {
      fontSize: scale(14),
      fontWeight: '400',
      flex: 1,
      marginRight: scale(8)
    },
    detailValue: {
      fontSize: scale(14),
      fontWeight: '400',
      textAlign: 'right',
      flex: 1
    },
    separator: {
      height: 1,
      backgroundColor: props?.gray200 || '#E5E7EB',
      marginVertical: verticalScale(12)
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    totalLabel: {
      fontSize: scale(16),
      fontWeight: '600'
    },
    totalValue: {
      fontSize: scale(14),
      fontWeight: '600',
      textAlign: 'right'
    }
  })

export default OrderSummaryDetails
