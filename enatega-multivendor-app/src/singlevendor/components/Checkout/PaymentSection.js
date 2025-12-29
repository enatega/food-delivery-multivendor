import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const PaymentSection = ({
  paymentMethod,
  onSelectPaymentMethod,
  selectedCard,
  selectedVoucher,
  onChangeCard,
  onChangeVoucher
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        bolder
        H4
        isRTL
        style={styles().sectionTitle}
      >
        {t('Payment') || 'Payment'}
      </TextDefault>

      {/* Card Payment Option */}
      <TouchableOpacity
        style={styles(currentTheme).paymentRow}
        onPress={onChangeCard}
        activeOpacity={0.7}
      >
        <View style={styles().paymentLeft}>
          <Image
            source={require('../../assets/images/payment-method.png')}
            style={styles().paymentMethodImage}
            resizeMode="contain"
          />
          <View style={styles().paymentContent}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              isRTL
            >
              {selectedCard}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              small
              isRTL
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

      {/* Voucher Option */}
      <TouchableOpacity
        style={styles(currentTheme).paymentRow}
        onPress={onChangeVoucher}
        activeOpacity={0.7}
      >
        <View style={styles().paymentLeft}>
          <Image
            source={require('../../assets/images/promo-icon.png')}
            style={styles().promoIcon}
            resizeMode="contain"
          />
          <View style={styles().paymentContent}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              isRTL
            >
              {selectedVoucher || (t('Promo_Code') || 'Promo Code')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              small
              isRTL
            >
              {selectedVoucher 
                ? (t('Tap here to change') || 'Tap here to change')
                : (t('Tap here to continue') || 'Tap here to continue')}
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
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      // borderTopWidth: 1,
      // borderTopColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    sectionTitle: {
      marginBottom: scale(12)
    },
    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: scale(16),
      // borderBottomWidth: 1,
      // borderBottomColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    paymentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    paymentMethodImage: {
      width: scale(32),
      height: scale(22),
      marginRight: scale(12)
    },
    promoIcon: {
      width: scale(32),
      height: scale(22),
      marginRight: scale(12)
    },
    paymentContent: {
      flex: 1,
      marginLeft: scale(0)
    }
  });

export default PaymentSection;
