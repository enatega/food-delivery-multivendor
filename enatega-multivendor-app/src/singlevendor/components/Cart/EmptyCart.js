import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { useTranslation } from 'react-i18next';
// import EmptyCartSVG from '../../../assets/SVG/imageComponents/EmptyCart';

const EmptyCart = ({ onStartShopping }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles().imageContainer}>
        {/* <EmptyCartSVG width={scale(200)} height={scale(200)} /> */}
        <Image 
          style={{ width: scale(200), height: scale(200) }}
          source={require('../../assets/images/emptycartnew.png')}
        />
      </View>
      
      <View style={styles().descriptionContainer}>
        <TextDefault 
          textColor={currentTheme.fontMainColor} 
          bolder 
          H3
          center
          style={{ marginBottom: scale(8) }}
        >
          {t('yourCartIsEmpty') || 'Your cart is empty'}
        </TextDefault>
        <TextDefault 
          textColor={currentTheme.fontSecondColor} 
          Normal
          center
          style={{ paddingHorizontal: scale(20) }}
        >
          {t('emptyCartDescription') || 'When you add items from a store, your order will be right here, so you can make changes whenever you want.'}
        </TextDefault>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles(currentTheme).button}
        onPress={onStartShopping}
      >
        <TextDefault 
          textColor={currentTheme.headerMainFontColor} 
          bold 
          H5
          center
        >
          {t('startShopping') || 'Start shopping'}
        </TextDefault>
      </TouchableOpacity>
    </View>
  );
};

const styles = (currentTheme = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(20),
      paddingVertical: scale(40)
    },
    imageContainer: {
      marginBottom: scale(30),
      alignItems: 'center',
      justifyContent: 'center'
    },
    descriptionContainer: {
      marginBottom: scale(30),
      alignItems: 'center'
    },
    button: {
      backgroundColor: currentTheme ? currentTheme.lightBlue : '#CCE9F5',
      paddingVertical: scale(14),
      paddingHorizontal: scale(40),
      borderRadius: scale(8),
      width: '100%',
      maxWidth: scale(300),
      alignItems: 'center'
    }
  });

export default EmptyCart;
