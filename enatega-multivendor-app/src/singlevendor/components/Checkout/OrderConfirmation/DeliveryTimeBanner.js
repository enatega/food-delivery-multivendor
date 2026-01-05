import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../../utils/themeColors';
import { scale } from '../../../../utils/scaling';
import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

const DeliveryTimeBanner = ({ minTime = 15, maxTime = 25 }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor="#fff"
        small
        isRTL
      >
        {t('Estimated delivery time') || 'Estimated delivery time'}
      </TextDefault>
      <TextDefault
        textColor="#fff"
        H3
        bolder
        isRTL
        style={styles().timeText}
      >
        {minTime}-{maxTime} {t('mins') || 'mins'}
      </TextDefault>
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      backgroundColor: props?.primaryBlue || '#0EA5E9',
      paddingVertical: scale(16),
      paddingHorizontal: scale(16),
      alignItems: 'center',
      borderRadius: scale(12),
      marginHorizontal: scale(16),
      marginTop: scale(8)
    },
    timeText: {
      marginTop: scale(4)
    }
  });

export default DeliveryTimeBanner;
