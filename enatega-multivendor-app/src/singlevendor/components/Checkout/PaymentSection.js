// import React, { useContext } from 'react';
// import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useTranslation } from 'react-i18next';
// import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
// import { theme } from '../../../utils/themeColors';
// import { scale } from '../../../utils/scaling';
// import TextDefault from '../../../components/Text/TextDefault/TextDefault';

// const PaymentSection = ({
//   paymentMethod,
//   onSelectPaymentMethod,
//   selectedCard,
//   selectedVoucher,
//   onChangeCard,
//   onChangeVoucher,
//   voucherBottomSheetRef
// }) => {
//   const { t, i18n } = useTranslation();
//   const themeContext = useContext(ThemeContext);
//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   };

//   return (
//     <View style={styles(currentTheme).container}>
//       <TextDefault
//         textColor={currentTheme.fontMainColor}
//         bolder
//         H4
//         isRTL
//         style={styles().sectionTitle}
//       >
//         {t('Payment') || 'Payment'}
//       </TextDefault>

//       {/* Card Payment Option */}
//       <TouchableOpacity
//         style={styles(currentTheme).paymentRow}
//         onPress={onChangeCard}
//         activeOpacity={0.7}
//       >
//         <View style={styles().paymentLeft}>
//           <Image
//             source={require('../../assets/images/payment-method.png')}
//             style={styles().paymentMethodImage}
//             resizeMode="contain"
//           />
//           <View style={styles().paymentContent}>
//             <TextDefault
//               textColor={currentTheme.fontMainColor}
//               bold
//               isRTL
//             >
//               {selectedCard}
//             </TextDefault>
//             <TextDefault
//               textColor={currentTheme.fontSecondColor}
//               small
//               isRTL
//             >
//               {t('Tap here to change') || 'Tap here to change'}
//             </TextDefault>
//           </View>
//         </View>
//         <Feather
//           name="chevron-right"
//           size={20}
//           color={currentTheme.fontSecondColor}
//         />
//       </TouchableOpacity>

//       {/* Voucher Option */}
//       <TouchableOpacity
//         style={styles(currentTheme).paymentRow}
//         onPress={() => voucherBottomSheetRef?.current?.open()}
//         activeOpacity={0.7}
//       >
//         <View style={styles().paymentLeft}>
//           <Image
//             source={require('../../assets/images/promo-icon.png')}
//             style={styles().promoIcon}
//             resizeMode="contain"
//           />
//           <View style={styles().paymentContent}>
//             <TextDefault
//               textColor={currentTheme.fontMainColor}
//               bold
//               isRTL
//             >
//               {selectedVoucher || (t('voucher') || 'Voucher')}
//             </TextDefault>
//             <TextDefault
//               textColor={currentTheme.fontSecondColor}
//               small
//               isRTL
//             >
//               {selectedVoucher
//                 ? (t('Tap here to change') || 'Tap here to change')
//                 : (t('Tap here to continue') || 'Tap here to continue')}
//             </TextDefault>
//           </View>
//         </View>
//         <Feather
//           name="chevron-right"
//           size={20}
//           color={currentTheme.fontSecondColor}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = (props = null) =>
//   StyleSheet.create({
//     container: {
//       paddingHorizontal: scale(16),
//       paddingVertical: scale(16),
//       // borderTopWidth: 1,
//       // borderTopColor: props !== null ? props.gray200 : '#E5E7EB'
//     },
//     sectionTitle: {
//       marginBottom: scale(12)
//     },
//     paymentRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       paddingVertical: scale(16),
//       // borderBottomWidth: 1,
//       // borderBottomColor: props !== null ? props.gray200 : '#E5E7EB'
//     },
//     paymentLeft: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1
//     },
//     paymentMethodImage: {
//       width: scale(32),
//       height: scale(22),
//       marginRight: scale(12)
//     },
//     promoIcon: {
//       width: scale(32),
//       height: scale(22),
//       marginRight: scale(12)
//     },
//     paymentContent: {
//       flex: 1,
//       marginLeft: scale(0)
//     }
//   });

// export default PaymentSection;

import React from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Feather, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import CheckoutSection from './CheckoutSection'
import useCheckoutPalette from './useCheckoutPalette'

const PaymentSection = ({
  paymentMethod,
  onSelectPaymentMethod,
  selectedCard,
  selectedVoucher,
  voucherCode,
  onChangeVoucherCode,
  onApplyVoucherCode,
  applyingVoucher,
  onRemoveVoucher,
  onOpenVouchers,
  voucherBottomSheetRef
}) => {
  const { t } = useTranslation()
  const { palette, isRTL } = useCheckoutPalette()
  const s = styles(palette)

  const paymentOptions = [
    {
      id: 'STRIPE',
      title: t('Card Payment') || 'Card Payment',
      subtitle: t('Pay using card') || 'Pay using card'
    },
    {
      id: 'PAYPAL',
      title: t('paypal') || 'Paypal',
      subtitle: t('payUsingPaypal') || 'Pay using Paypal'
    },
    {
      id: 'COD',
      title: t('cod') || 'Cash on Delivery',
      subtitle: 'Cash on Delivery'
    }
  ]

  if (Platform.OS === 'android') {
    paymentOptions.push({
      id: 'GOOGLE_PAY',
      title: t('googlePay') || 'Google Pay',
      subtitle: t('payUsingGooglePay') || 'Pay using Google Pay'
    })
  } else {
    paymentOptions.push({
      id: 'APPLE_PAY',
      title: t('applePay') || 'Apple Pay',
      subtitle: t('payUsingApplePay') || 'Pay using Apple Pay'
    })
  }

  const renderMethodIcon = (id, isSelected) => {
    const color = isSelected ? palette.brandText : palette.textPrimary
    const size = scale(19)
    switch (id) {
      case 'STRIPE':
        return <Ionicons name='card-outline' size={size} color={color} />
      case 'PAYPAL':
        return <Ionicons name='logo-paypal' size={size} color={isSelected ? color : '#1E6FD9'} />
      case 'COD':
        return <MaterialCommunityIcons name='cash' size={scale(21)} color={color} />
      case 'GOOGLE_PAY':
        return <FontAwesome name='google' size={scale(17)} color={isSelected ? color : '#4285F4'} />
      case 'APPLE_PAY':
        return <Ionicons name='logo-apple' size={size} color={color} />
      default:
        return null
    }
  }

  return (
    <CheckoutSection icon='wallet-outline' title={t('Payment') || 'Payment'}>
      <View style={s.optionsList}>
        {paymentOptions.map((option) => {
          const isSelected = paymentMethod === option.id

          return (
            <TouchableOpacity
              key={option.id}
              style={[s.optionCard, isSelected && s.optionCardSelected]}
              onPress={() => onSelectPaymentMethod(option.id)}
              activeOpacity={0.75}
              accessibilityRole='radio'
              accessibilityState={{ selected: isSelected }}
            >
              <View style={[s.methodIcon, isSelected && s.methodIconSelected]}>{renderMethodIcon(option.id, isSelected)}</View>

              <View style={s.optionContent}>
                <TextDefault textColor={palette.textPrimary} bold bolder={isSelected} isRTL>
                  {option.title}
                </TextDefault>
                <TextDefault textColor={palette.textMuted} small isRTL style={s.optionSubtitle}>
                  {option.subtitle}
                </TextDefault>
              </View>

              <View style={[s.radioOuter, isSelected && s.radioOuterSelected]}>
                {isSelected && <Feather name='check' size={scale(12)} color={palette.onBrand} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Voucher */}
      <TouchableOpacity
        style={[s.voucherCard, selectedVoucher && s.voucherCardApplied]}
        onPress={() => voucherBottomSheetRef?.current?.open()}
        activeOpacity={0.75}
      >
        <View style={s.voucherIcon}>
          <MaterialCommunityIcons name='ticket-percent-outline' size={scale(20)} color={palette.brandText} />
        </View>
        <View style={s.optionContent}>
          <TextDefault textColor={palette.textPrimary} bolder isRTL numberOfLines={1}>
            {selectedVoucher?.title || t('Voucher')}
          </TextDefault>
          <TextDefault textColor={selectedVoucher ? palette.brandText : palette.textMuted} small isRTL style={s.optionSubtitle}>
            {selectedVoucher ? t('Tap here to change') : t('Tap here to continue')}
          </TextDefault>
        </View>
        <Feather name={isRTL ? 'chevron-left' : 'chevron-right'} size={scale(18)} color={palette.textMuted} />
      </TouchableOpacity>

      <View style={s.voucherActionsRow}>
        <TouchableOpacity
          style={s.voucherNavButton}
          onPress={onOpenVouchers}
          activeOpacity={0.7}
          disabled={!!selectedVoucher}
        >
          <MaterialCommunityIcons name='tag-multiple-outline' size={scale(15)} color={palette.textSecondary} style={s.voucherNavIcon} />
          <TextDefault textColor={palette.textPrimary} bold small numberOfLines={1}>
            {selectedVoucher?.title || t('viewVouchers') || 'View vouchers'}
          </TextDefault>
        </TouchableOpacity>
        {selectedVoucher
          ? (
          <TouchableOpacity style={s.voucherRemoveButton} onPress={onRemoveVoucher} activeOpacity={0.7}>
            <Feather name='x' size={scale(14)} color={palette.danger} style={s.voucherNavIcon} />
            <TextDefault textColor={palette.danger} bold small>
              {t('remove') || 'Remove'}
            </TextDefault>
          </TouchableOpacity>
            )
          : null}
      </View>
    </CheckoutSection>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    optionsList: {
      gap: scale(6)
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(52),
      paddingVertical: scale(8),
      paddingHorizontal: scale(10),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface
    },
    optionCardSelected: {
      borderColor: palette.brandBorder,
      backgroundColor: palette.brandSubtle
    },
    methodIcon: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(9),
      backgroundColor: palette.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12)
    },
    methodIconSelected: {
      backgroundColor: palette.surface
    },
    optionContent: {
      flex: 1,
      paddingRight: scale(8)
    },
    optionSubtitle: {
      marginTop: scale(1)
    },
    radioOuter: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: palette.borderStrong,
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioOuterSelected: {
      borderColor: palette.brand,
      backgroundColor: palette.brand
    },
    voucherCard: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(52),
      marginTop: scale(8),
      paddingVertical: scale(8),
      paddingHorizontal: scale(10),
      borderRadius: scale(12),
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: palette.brandBorder,
      backgroundColor: palette.surface
    },
    voucherCardApplied: {
      borderStyle: 'solid',
      backgroundColor: palette.brandSubtle
    },
    voucherIcon: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(9),
      backgroundColor: palette.brandSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12)
    },
    voucherActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: scale(8),
      gap: scale(8)
    },
    voucherNavButton: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(32),
      paddingHorizontal: scale(12),
      borderRadius: scale(17),
      backgroundColor: palette.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border
    },
    voucherNavIcon: {
      marginRight: scale(6)
    },
    voucherRemoveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(32),
      paddingHorizontal: scale(12),
      borderRadius: scale(17),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.dangerBorder,
      backgroundColor: palette.dangerSubtle
    }
  })

export default PaymentSection
