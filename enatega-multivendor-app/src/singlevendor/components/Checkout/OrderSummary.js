import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const OrderSummary = ({
  subtotal,
  deliveryFee,
  tipAmount,
  total,
  currencySymbol = '€',
  expanded,
  onToggleExpanded
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      {/* Summary Header */}
      <TouchableOpacity
        style={styles().summaryHeader}
        onPress={onToggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles().summaryHeaderLeft}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            H5
            isRTL
          >
            {t('Summary') || 'Summary'}
          </TextDefault>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={currentTheme.fontMainColor}
            style={styles().chevron}
          />
        </View>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          bolder
          H5
          isRTL
        >
          {currencySymbol} {total.toFixed(2)}
        </TextDefault>
      </TouchableOpacity>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles().summaryDetails}>
          <View style={styles().summaryRow}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              isRTL
              bold
            >
              {t('Subtotal') || 'Subtotal'}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              isRTL
            >
              {currencySymbol} {subtotal.toFixed(2)}
            </TextDefault>
          </View>

          {deliveryFee > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                isRTL
              >
                {t('Delivery fee') || 'Delivery fee'}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                isRTL
              >
                {currencySymbol} {deliveryFee.toFixed(2)}
              </TextDefault>
            </View>
          )}

          {tipAmount > 0 && (
            <View style={styles().summaryRow}>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                isRTL
                bold
              >
                {t('Tip') || 'Tip'}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                isRTL
              >
                {currencySymbol} {tipAmount.toFixed(2)}
              </TextDefault>
            </View>
          )}

          <View style={styles(currentTheme).divider} />

          <View style={styles().summaryRow}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              isRTL
              H5

            >
              {t('Total') || 'Total'}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H5
              isRTL
            >
              {currencySymbol} {total.toFixed(2)}
            </TextDefault>
          </View>
        </View>
      )}

      <TextDefault
        textColor={currentTheme.fontSecondColor}
        small
        isRTL
        bolder
        style={styles().taxNote}
      >
        {t('incl. taxes (if applicable)') || 'incl. taxes (if applicable)'}
      </TextDefault>
    </View>
  );
};

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
  });

export default OrderSummary;
