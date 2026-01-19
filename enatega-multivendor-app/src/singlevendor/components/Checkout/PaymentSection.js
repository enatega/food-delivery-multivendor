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
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
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
      id: 'CARD',
      title: t('Card Payment') || 'Card Payment',
      subtitle: t('Pay using card') || 'Pay using card'
    },
    {
      id: 'COD',
      title: t('Cash on Delivery') || 'Cash on Delivery',
      subtitle:
        t('Pay with cash when order arrives') ||
        'Pay with cash when order arrives'
    }
  ]

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        bolder
        H4
        style={styles().sectionTitle}
      >
        {t('Payment') || 'Payment'}
      </TextDefault>

      {/* ===== PAYMENT METHOD SELECTOR (DeliveryTimeOptions STYLE) ===== */}
      {paymentOptions.map(option => {
        const isSelected = paymentMethod === option.id

        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles(currentTheme).optionCard,
              isSelected && styles(currentTheme).optionCardSelected
            ]}
            onPress={() => onSelectPaymentMethod(option.id)}
            activeOpacity={0.7}
          >
            {/* Radio */}
            <View style={styles().radioButton}>
              <View
                style={[
                  styles(currentTheme).radioOuter,
                  isSelected && styles(currentTheme).radioOuterSelected
                ]}
              >
                {isSelected && (
                  <View style={styles(currentTheme).radioInner} />
                )}
              </View>
            </View>

            {/* Content */}
            <View style={styles().optionContent}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bold
                bolder={isSelected}
              >
                {option.title}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                small
              >
                {option.subtitle}
              </TextDefault>
            </View>

            {/* Check icon */}
            {isSelected && (
              <Feather
                name="check-circle"
                size={20}
                color={currentTheme.primaryBlue || '#0EA5E9'}
                style={styles().checkIcon}
              />
            )}
          </TouchableOpacity>
        )
      })}

      {/* ===== ORIGINAL CARD + VOUCHER UI (UNCHANGED) ===== */}
      {paymentMethod === 'card' && (
        <>
          {/* Card */}
          <TouchableOpacity
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
          </TouchableOpacity>

          {/* Voucher */}
          
        </>
      )}

      <TouchableOpacity
            style={styles(currentTheme).paymentRow}
            onPress={() => voucherBottomSheetRef?.current?.open()}
            activeOpacity={0.7}
          >
            <View style={styles().paymentLeft}>
              <Image
                source={require('../../assets/images/promo-icon.png')}
                style={styles().paymentIcon}
                resizeMode="contain"
              />
              <View>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  bold
                >
                  {selectedVoucher?.title || t('Voucher')}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme.fontSecondColor}
                  small
                >
                  {selectedVoucher
                    ? t('Tap here to change')
                    : t('Tap here to continue')}
                </TextDefault>
              </View>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={currentTheme.fontSecondColor}
            />
          </TouchableOpacity>
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
      backgroundColor: props
        ? props.colorBgSecondary || 'rgba(14,165,233,0.08)'
        : 'rgba(14,165,233,0.08)'
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
    }
  })

export default PaymentSection
