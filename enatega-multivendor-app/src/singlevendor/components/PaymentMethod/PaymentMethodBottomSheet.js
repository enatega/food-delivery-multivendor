import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const PaymentMethodBottomSheet = React.forwardRef(({ onSetDefault, onRemove }, ref) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const handleSetDefault = () => {
    onSetDefault?.();
    ref?.current?.close();
  };

  const handleRemove = () => {
    onRemove?.();
    ref?.current?.close();
  };

  const handleClose = () => {
    ref?.current?.close();
  };

  return (
    <Modalize
      ref={ref}
      adjustToContentHeight
      handlePosition="inside"
      modalStyle={styles(currentTheme).modalStyle}
      handleStyle={styles(currentTheme).handleStyle}
    >
      <View style={styles(currentTheme).container}>
        <View style={styles().header}>
          <TextDefault
            textColor={currentTheme.CharcoalBlack}
            bolder
            H3
          >
            {t('More options') || 'More options'}
          </TextDefault>
          <TouchableOpacity
            onPress={handleClose}
            style={styles(currentTheme).closeButton}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={18} color={currentTheme.CharcoalBlack} />
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).optionsContainer}>

          <TouchableOpacity
            style={styles(currentTheme).optionButton}
            onPress={handleSetDefault}
            activeOpacity={0.7}
          >
            <AntDesign 
              name="check" 
              size={20} 
              color={currentTheme.fontMainColor} 
            />
            <TextDefault
              textColor={currentTheme.CharcoalBlack}
              H5
              style={styles().optionText}
              bold
            >
              {t('Set as default') || 'Set as default'}
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(currentTheme).optionButton}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="delete-outline" 
              size={20} 
              color={currentTheme.red600} 
            />
            <TextDefault
              textColor={currentTheme.red600}
              H5
              style={styles().optionText}
              bold
            >
              {t('Remove payment method') || 'Remove payment method'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
});

const styles = (props = null) =>
  StyleSheet.create({
    modalStyle: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20)
    },
    handleStyle: {
      backgroundColor: props !== null ? props.fontSecondColor : '#D1D5DB',
      width: scale(60),
      height: scale(5)
    },
    container: {
      paddingHorizontal: scale(20),
      paddingTop: scale(40),
      paddingBottom: scale(40)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(24),
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      width: scale(30),
      height: scale(30),
      borderRadius: scale(20),
      backgroundColor: props !== null ? props.colorBgTertiary : '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    optionsContainer: {
      gap: scale(16)
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(12),
      gap: scale(12)
    },
    optionText: {
      fontWeight: '500',
      marginLeft: scale(8)
    }
  });

export default PaymentMethodBottomSheet;
