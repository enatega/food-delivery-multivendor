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

import React, { useContext } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Platform, TextInput } from 'react-native'
import { Feather, Ionicons, FontAwesome } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

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
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

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
      subtitle:  'Cash on Delivery'
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

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault textColor={currentTheme.fontMainColor} bolder H4 style={styles().sectionTitle}>
        {t('Payment') || 'Payment'}
      </TextDefault>

      {/* ===== PAYMENT METHOD SELECTOR (DeliveryTimeOptions STYLE) ===== */}
      {paymentOptions.map((option) => {
        const isSelected = paymentMethod === option.id

        return (
          <TouchableOpacity key={option.id} style={[styles(currentTheme).optionCard, isSelected && styles(currentTheme).optionCardSelected]} onPress={() => onSelectPaymentMethod(option.id)} activeOpacity={0.7}>
            {/* Left icon (logo when not selected for Apple/Google, otherwise radio) */}
            <View style={styles().radioButton}>
              {!isSelected && option.id === 'GOOGLE_PAY' ? (
                <FontAwesome name='google' size={18} color='#4285F4' />
              ) : 
              !isSelected && option.id === 'APPLE_PAY' ? (
                <Ionicons name='logo-apple' size={20} color={currentTheme.fontMainColor || '#111'} />
              )
               :
               !isSelected && option.id === 'PAYPAL' ? (
                <Ionicons name='logo-paypal' size={20} color={currentTheme.fontMainColor || '#111'} />
              )
               :
               !isSelected && option.id === 'STRIPE' ? (
                <Ionicons name='card' size={20} color={currentTheme.fontMainColor || '#111'} />
              )
              : 
              (
                <View style={[styles(currentTheme).radioOuter, isSelected && styles(currentTheme).radioOuterSelected]}>{isSelected && <View style={styles(currentTheme).radioInner} />}</View>
              )}
            </View>

            {/* Content */}
            <View style={styles().optionContent}>
              <TextDefault textColor={currentTheme.fontMainColor} bold bolder={isSelected}>
                {option.title}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontSecondColor} small>
                {option.subtitle}
              </TextDefault>
            </View>

            {/* Check icon */}
            {isSelected && <Feather name='check-circle' size={20} color={currentTheme.primaryBlue || '#0EA5E9'} style={styles().checkIcon} />}
          </TouchableOpacity>
        )
      })}

      {/* ===== ORIGINAL CARD + VOUCHER UI (UNCHANGED) ===== */}
      {paymentMethod === 'STRIPE' && (
        <>
          {/* Card */}
          {/* <TouchableOpacity
            style={styles(currentTheme).paymentRow}
            activeOpacity={0.7}
          >
            <View style={styles().paymentLeft}>
              <Image
                source={require('../../assets/images/payment-method.png')}
                style={styles().paymentIcon}
                resizeMode="contain"
              />
              <View>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  bold
                >
                  {selectedCard}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme.fontSecondColor}
                  small
                >
                  {t('Tap here to change') || 'Tap here to change'}
                </TextDefault>
              </View>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={currentTheme.fontSecondColor}
            />
          </TouchableOpacity> */}

          {/* Voucher */}
        </>
      )}

      <TouchableOpacity style={styles(currentTheme).paymentRow} onPress={() => voucherBottomSheetRef?.current?.open()} activeOpacity={0.7}>
        <View style={styles().paymentLeft}>
          <Image source={require('../../assets/images/promo-icon.png')} style={styles().paymentIcon} resizeMode='contain' />
          <View>
            <TextDefault textColor={currentTheme.fontMainColor} bold>
              {selectedVoucher?.title || t('Voucher')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} small>
              {selectedVoucher ? t('Tap here to change') : t('Tap here to continue')}
            </TextDefault>
          </View>
        </View>
        <Feather name='chevron-right' size={20} color={currentTheme.fontSecondColor} />
      </TouchableOpacity>

      <View style={styles().voucherActionsRow}>
        <TouchableOpacity
          style={styles(currentTheme).voucherNavButton}
          onPress={onOpenVouchers}
          activeOpacity={0.7}
          disabled={!!selectedVoucher}
        >
          <TextDefault textColor={currentTheme.fontMainColor} bold>
            {selectedVoucher?.title || t('viewVouchers') || 'View vouchers'}
          </TextDefault>
        </TouchableOpacity>
        {selectedVoucher ? (
          <TouchableOpacity style={styles(currentTheme).voucherRemoveButton} onPress={onRemoveVoucher} activeOpacity={0.7}>
            <TextDefault textColor={currentTheme.fontMainColor} bold>
              {t('remove') || 'Remove'}
            </TextDefault>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* <View style={styles().voucherInputRow}>
        <TextInput
          style={styles(currentTheme).voucherInput}
          placeholder={t('voucherCode')}
          placeholderTextColor={currentTheme.fontSecondColor}
          value={voucherCode}
          onChangeText={onChangeVoucherCode}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles(currentTheme).voucherApplyButton, !voucherCode?.trim() && styles(currentTheme).voucherApplyButtonDisabled]}
          onPress={onApplyVoucherCode}
          disabled={!voucherCode?.trim() || applyingVoucher}
          activeOpacity={0.7}
        >
          <TextDefault textColor={voucherCode?.trim() ? '#fff' : currentTheme.fontSecondColor} bolder>
            {t('apply') || 'Apply'}
          </TextDefault>
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16)
    },
    sectionTitle: {
      marginBottom: scale(12)
    },

    /* ===== Selector cards (same as DeliveryTimeOptions) ===== */
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(12),
      paddingHorizontal: scale(16),
      marginBottom: scale(8),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props ? props.gray200 : '#E5E7EB',
      backgroundColor: props ? props.themeBackground : '#fff'
    },
    optionCardSelected: {
      borderColor: props ? props.primaryBlue : '#0EA5E9',
      borderWidth: 2,
      backgroundColor: props ? props.colorBgSecondary || 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.08)'
    },
    radioButton: {
      marginRight: scale(12)
    },
    radioOuter: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: props ? props.gray300 : '#D1D5DB',
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioOuterSelected: {
      borderColor: props ? props.primaryBlue : '#0EA5E9'
    },
    radioInner: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: props ? props.primaryBlue : '#0EA5E9'
    },
    optionContent: {
      flex: 1
    },
    checkIcon: {
      marginLeft: scale(8)
    },

    /* ===== Old Card / Voucher UI ===== */
    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(14)
    },
    paymentLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    paymentIcon: {
      width: scale(32),
      height: scale(22),
      marginRight: scale(12)
    },
    voucherActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(0)
    },
    voucherNavButton: {
      paddingVertical: scale(6),
      paddingHorizontal: scale(10),
      borderRadius: scale(6),
      borderWidth: 1,
      borderColor: props ? props.gray200 : '#E5E7EB'
    },
    voucherRemoveButton: {
      paddingVertical: scale(6),
      paddingHorizontal: scale(10),
      borderRadius: scale(6),
      backgroundColor: props ? props.gray200 : '#E5E7EB'
    },
    voucherInputRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    voucherInput: {
      flex: 1,
      height: scale(40),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props ? props.gray200 : '#E5E7EB',
      backgroundColor: props ? props.gray100 : '#F9FAFB',
      paddingHorizontal: scale(12),
      fontSize: scale(14),
      color: props ? props.fontMainColor : '#000',
      fontFamily: 'Poppins-Regular'
    },
    voucherApplyButton: {
      height: scale(40),
      paddingHorizontal: scale(14),
      borderRadius: scale(8),
      marginLeft: scale(8),
      backgroundColor: props ? props.singlevendorcolor : '#0090CD',
      alignItems: 'center',
      justifyContent: 'center'
    },
    voucherApplyButtonDisabled: {
      backgroundColor: props ? props.gray200 : '#E5E7EB'
    }
  })

export default PaymentSection
