import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../../utils/themeColors';
import { scale } from '../../../../utils/scaling';
import TextDefault from '../../../../components/Text/TextDefault/TextDefault';

const DeliveredStatus = ({ appName = 'FAST' }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).iconContainer}>
        <Feather name="check" size={48} color="#fff" />
      </View>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        H3
        bolder
        isRTL
        style={styles().title}
      >
        {t('Delivered') || 'Delivered'}
      </TextDefault>
      <TextDefault
        textColor={currentTheme.gray500}
        isRTL
        center
        style={styles().subtitle}
      >
        {t('Your grocery has been delivered.') || 'Your grocery has been delivered.'}
      </TextDefault>
      <TextDefault
        textColor={currentTheme.gray500}
        isRTL
        center
      >
        {t('Thanks for using') || 'Thanks for using'} {appName}.
      </TextDefault>
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: scale(32),
      paddingHorizontal: scale(16)
    },
    iconContainer: {
      width: scale(96),
      height: scale(96),
      borderRadius: scale(48),
      backgroundColor: props?.primaryBlue || '#0EA5E9',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(16)
    },
    title: {
      marginBottom: scale(8)
    },
    subtitle: {
      marginBottom: scale(4)
    }
  });

export default DeliveredStatus;
