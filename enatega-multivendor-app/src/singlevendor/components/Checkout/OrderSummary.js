import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useCheckoutPalette from './useCheckoutPalette'

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
  isCheckout,
  creditsUsed,
  dealDiscount = 0
}) => {
  const { t } = useTranslation()
  const { palette } = useCheckoutPalette()

  const totalPlusTip = total + (isCheckout ? tipAmount + priorityDeliveryFee : 0)

  return (
    <View style={styles(palette).container}>
      {/* Summary Header */}
      <TouchableOpacity style={styles().summaryHeader} onPress={onToggleExpanded} activeOpacity={0.7}>
        <View style={styles().summaryHeaderLeft}>
          <TextDefault textColor={palette.textPrimary} bolder H5 isRTL>
            {t('Summary') || 'Summary'}
          </TextDefault>
          <View style={styles(palette).chevron}>
            <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={palette.textPrimary} />
          </View>
        </View>
        <TextDefault textColor={palette.textPrimary} bolder H5 isRTL>
          {totalPlusTip.toFixed(2)}&nbsp;{currencySymbol}
        </TextDefault>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles().summaryDetails}>
          {orderNumber && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL bold>
                {t('Order number') || 'Order number'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {orderNumber}
              </TextDefault>
            </View>
          )}

          <View style={styles().summaryRow}>
            <TextDefault textColor={palette.textSecondary} isRTL bold>
              {t('Item subtotal') || 'Item subtotal'}
            </TextDefault>
            <TextDefault textColor={palette.textPrimary} isRTL>
              {(subtotal + dealDiscount).toFixed(2)}&nbsp;{currencySymbol}
            </TextDefault>
          </View>

          {serviceFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL>
                {t('Service fee') || 'Service fee'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {serviceFee.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {minimumOrderFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL>
                {t('Low order fee') || 'Low order fee'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {minimumOrderFee.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {priorityDeliveryFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL>
                {t('Priority order fee') || 'Priority order fee'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {priorityDeliveryFee.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {/* {deliveryFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL>
                {t('Delivery fee') || 'Delivery fee'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {currencySymbol} {deliveryFee.toFixed(2)}
              </TextDefault>
            </View>
          )} */}

          {originalDeliveryCharges > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL>
                {t('deliveryFee') || 'Delivery fee'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {originalDeliveryCharges.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {deliveryDiscount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.success} isRTL>
                {t('deliveryDiscount') || 'Delivery discount'}
              </TextDefault>
              <TextDefault textColor={palette.success} isRTL>
                -{deliveryDiscount.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {couponDiscountAmount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.success} isRTL>
                {t('Coupon Amount') || 'Coupon Amount'}
              </TextDefault>
              <TextDefault textColor={palette.success} isRTL>
                -{couponDiscountAmount.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {dealDiscount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.success} isRTL>
                {t('Deals savings', { defaultValue: 'Deals savings' })}
              </TextDefault>
              <TextDefault textColor={palette.success} isRTL>
                -{dealDiscount.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {creditsUsed > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.success} isRTL>
                {t('Credits Used') || 'Credits Used'}
              </TextDefault>
              <TextDefault textColor={palette.success} isRTL>
                -{creditsUsed.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          {tipAmount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault textColor={palette.textSecondary} isRTL bold>
                {t('Tip') || 'Tip'}
              </TextDefault>
              <TextDefault textColor={palette.textPrimary} isRTL>
                {tipAmount.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            </View>
          )}

          <View style={styles(palette).divider} />

          <View style={styles().summaryRow}>
            <TextDefault textColor={palette.textPrimary} bolder isRTL H5>
              {t('total') || 'Total'}
            </TextDefault>
            <TextDefault textColor={palette.textPrimary} bolder H5 isRTL>
              {totalPlusTip.toFixed(2)}&nbsp;{currencySymbol}
            </TextDefault>
          </View>
        </View>
      )}

      <TextDefault textColor={palette.textMuted} small isRTL style={styles().taxNote}>
        {t('incl. taxes (if applicable)') || 'incl. taxes (if applicable)'}
      </TextDefault>

      {freeDeliveriesRemaining > 0 && (
        <TextDefault textColor={palette.success} small isRTL bold style={styles().taxNote}>
          {t('free delivery applied') || 'free delivery applied'}
        </TextDefault>
      )}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingBottom: scale(2)
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: scale(30)
    },
    summaryHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    chevron: {
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
      marginLeft: scale(8),
      backgroundColor: props !== null ? props.surfaceMuted : '#F4F4F5',
      alignItems: 'center',
      justifyContent: 'center'
    },
    summaryDetails: {
      marginTop: scale(10)
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8)
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: props !== null ? props.border : '#E5E7EB',
      marginTop: scale(2),
      marginBottom: scale(10)
    },
    taxNote: {
      marginTop: scale(1)
    }
  })

export default OrderSummary
