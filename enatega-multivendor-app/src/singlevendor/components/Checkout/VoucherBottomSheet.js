import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useMutation } from '@apollo/client'
import { COUPON } from '../../apollo/mutations'
import useCheckoutPalette from './useCheckoutPalette'

const VoucherBottomSheet = React.forwardRef(({ onApplyVoucher }, ref) => {
  const [applyCoupon, { loading: applyingCoupon }] = useMutation(COUPON, {
    onCompleted: (data) => {
      console.log('coupon applied successfully', data)
      if (!data?.coupon?.success) {
        Alert.alert('Coupon Error', data?.coupon?.message || 'Failed to apply coupon')
      } else {
        console.log('Applied Coupon:', data?.coupon?.title)

        onApplyVoucher(data?.coupon?.coupon)
        setVoucherCode('')
        ref?.current?.close()
      }
    },
    onError: (err) => {
      console.log('Error applying coupon', err)
    }
  })

  const { t } = useTranslation()
  const { palette, isRTL } = useCheckoutPalette()
  const s = styles(palette)

  const [voucherCode, setVoucherCode] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const hasCode = !!voucherCode.trim()

  const handleApply = () => {
    if (voucherCode.trim()) {
      applyCoupon({
        variables: { coupon: voucherCode.trim() }
      })
    }
  }

  const handleClose = () => {
    setVoucherCode('')
    ref?.current?.close()
  }

  return (
    <Modalize ref={ref} adjustToContentHeight handlePosition='inside' modalStyle={s.modalStyle} handleStyle={s.handleStyle} overlayStyle={s.overlay} keyboardAvoidingOffset={100}>
      <View style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerIcon}>
            <MaterialCommunityIcons name='ticket-percent-outline' size={22} color={palette.brandText} />
          </View>
          <TextDefault textColor={palette.textPrimary} bolder H4 isRTL style={s.headerTitle} numberOfLines={1}>
            {t('enterVoucher')}
          </TextDefault>
          <TouchableOpacity onPress={handleClose} style={s.closeButton} activeOpacity={0.7} hitSlop={8} accessibilityRole='button' accessibilityLabel={t('Close') || 'Close'}>
            <AntDesign name='close' size={16} color={palette.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <View style={[s.inputContainer, isFocused && s.inputContainerFocused]}>
          <MaterialCommunityIcons name='tag-outline' size={18} color={isFocused ? palette.brandText : palette.textMuted} />
          <TextInput
            style={[s.input, isRTL && s.inputRTL]}
            placeholder={t('voucherCode')}
            placeholderTextColor={palette.textMuted}
            selectionColor={palette.brand}
            value={voucherCode}
            onChangeText={setVoucherCode}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleApply}
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
          />
          {voucherCode.length > 0 && (
            <TouchableOpacity onPress={() => setVoucherCode('')} hitSlop={8} activeOpacity={0.7} style={s.clearButton}>
              <AntDesign name='close' size={11} color={palette.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={[s.applyButton, !hasCode && s.applyButtonDisabled]} onPress={handleApply} disabled={!hasCode} activeOpacity={0.8}>
          {applyingCoupon
            ? (
            <ActivityIndicator size='small' color={palette.onBrand} />
              )
            : (
            <TextDefault textColor={hasCode ? palette.onBrand : palette.disabledText} bolder H5>
              {t('apply')}
            </TextDefault>
              )}
        </TouchableOpacity>
      </View>
    </Modalize>
  )
})

VoucherBottomSheet.displayName = 'VoucherBottomSheet'

const styles = (palette) =>
  StyleSheet.create({
    modalStyle: {
      backgroundColor: palette.surface,
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24)
    },
    overlay: {
      backgroundColor: palette.overlay
    },
    handleStyle: {
      backgroundColor: palette.borderStrong,
      width: scale(40),
      height: scale(4)
    },
    container: {
      paddingHorizontal: scale(16),
      paddingTop: scale(26),
      paddingBottom: scale(28)
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(16)
    },
    headerIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(12),
      backgroundColor: palette.brandSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12)
    },
    headerTitle: {
      flex: 1
    },
    closeButton: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      backgroundColor: palette.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: scale(8)
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(52),
      paddingHorizontal: scale(14),
      marginBottom: scale(12),
      borderRadius: scale(14),
      borderWidth: 1.5,
      borderColor: palette.border,
      backgroundColor: palette.surfaceMuted
    },
    inputContainerFocused: {
      borderColor: palette.brandBorder,
      backgroundColor: palette.surface
    },
    input: {
      flex: 1,
      height: '100%',
      marginLeft: scale(10),
      paddingVertical: 0,
      fontSize: scale(15),
      letterSpacing: 0.8,
      color: palette.textPrimary,
      fontWeight: '600'
    },
    inputRTL: {
      textAlign: 'right'
    },
    clearButton: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      backgroundColor: palette.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: scale(8)
    },
    applyButton: {
      height: scale(50),
      borderRadius: scale(14),
      backgroundColor: palette.brand,
      alignItems: 'center',
      justifyContent: 'center'
    },
    applyButtonDisabled: {
      backgroundColor: palette.disabledBackground
    }
  })

export default VoucherBottomSheet
