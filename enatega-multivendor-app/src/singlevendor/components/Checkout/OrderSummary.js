import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const OrderSummary = ({
  // subtotal,
  // deliveryFee,
  // tipAmount,
  // total,
  subtotal,
  deliveryFee,
  serviceFee,
  deliveryDiscount,
  originalDeliveryCharges,
  tipAmount,
  total,
  currencySymbol = '€',
  expanded,
  onToggleExpanded,
  freeDeliveriesRemaining,
  minimumOrderFee,
  couponDiscountAmount,
  priorityDeliveryFee = 0,
  orderNumber = null,
  isCheckout
}) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const totalPlusTip = total + (isCheckout ? tipAmount + priorityDeliveryFee : 0)

  return (
    <View style={styles(currentTheme).container}>
      {/* Summary Header */}
      <TouchableOpacity style={styles().summaryHeader} onPress={onToggleExpanded} activeOpacity={0.7}>
        <View style={styles().summaryHeaderLeft}>
          <TextDefault textColor={currentTheme.fontMainColor} bolder H5 isRTL>
            {t('Summary') || 'Summary'}
          </TextDefault>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={currentTheme.fontMainColor} style={styles().chevron} />
        </View>
        <TextDefault textColor={currentTheme.fontMainColor} bolder H5 isRTL>
          {currencySymbol} {totalPlusTip.toFixed(2)}
        </TextDefault>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles().summaryDetails}>
          {orderNumber && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL bold>
                {t('Order number') || 'Order number'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {orderNumber}
              </TextDefault>
            </View>
          )}

          <View style={styles().summaryRow}>
            <TextDefault textColor={currentTheme.fontSecondColor} isRTL bold>
              {t('Item subtotal') || 'Item subtotal'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} isRTL>
              {currencySymbol} {subtotal.toFixed(2)}
            </TextDefault>
          </View>

          {serviceFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL>
                {t('Service fee') || 'Service fee'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {serviceFee.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {minimumOrderFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL>
                {t('Low order fee') || 'Low order fee'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {minimumOrderFee.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {priorityDeliveryFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL>
                {t('Priority order fee') || 'Priority order fee'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {priorityDeliveryFee.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {/* {deliveryFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL>
                {t('Delivery fee') || 'Delivery fee'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {deliveryFee.toFixed(2)}
              </TextDefault>
            </View>
          )} */}

          {originalDeliveryCharges > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL>
                {t('Delivery fee') || 'Delivery fee'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {originalDeliveryCharges.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {deliveryDiscount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.success || '#16A34A'} isRTL>
                {t('Delivery discount') || 'Delivery discount'}
              </TextDefault>
              <TextDefault textColor={currentTheme.success || '#16A34A'} isRTL>
                -{currencySymbol} {deliveryDiscount.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {couponDiscountAmount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.success || '#16A34A'} isRTL>
                {t('Coupon Amount') || 'Coupon Amount'}
              </TextDefault>
              <TextDefault textColor={currentTheme.success || '#16A34A'} isRTL>
                -{currencySymbol} {couponDiscountAmount.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {tipAmount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={currentTheme.fontSecondColor} isRTL bold>
                {t('Tip') || 'Tip'}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                {currencySymbol} {tipAmount.toFixed(2)}
              </TextDefault>
            </View>
          )}

          <View style={styles(currentTheme).divider} />

          <View style={styles().summaryRow}>
            <TextDefault textColor={currentTheme.fontMainColor} bolder isRTL H5>
              {t('Total') || 'Total'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} bolder H5 isRTL>
              {currencySymbol} {totalPlusTip.toFixed(2)}
            </TextDefault>
          </View>
        </View>
      )}

      <TextDefault textColor={currentTheme.fontSecondColor} small isRTL bolder style={styles().taxNote}>
        {t('incl. taxes (if applicable)') || 'incl. taxes (if applicable)'}
      </TextDefault>

      {freeDeliveriesRemaining > 0 && (
        <TextDefault textColor={currentTheme.fontSecondColor} small isRTL bolder style={styles().taxNote}>
          {t('free delivery applied') || 'free delivery applied'}
        </TextDefault>
      )}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingBottom: scale(8)
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8)
    },
    summaryHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    chevron: {
      marginLeft: scale(8)
    },
    summaryDetails: {
      marginTop: scale(12)
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(12)
    },
    divider: {
      height: 1,
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB',
      marginVertical: scale(8)
    },
    taxNote: {
      marginTop: scale(4)
    }
  })

export default OrderSummary
