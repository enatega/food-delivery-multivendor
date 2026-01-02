import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const VoucherBottomSheet = React.forwardRef(({ onApplyVoucher }, ref) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [voucherCode, setVoucherCode] = useState('');

  const handleApply = () => {
    if (voucherCode.trim()) {
      onApplyVoucher(voucherCode.trim());
      setVoucherCode('');
      ref?.current?.close();
    }
  };

  const handleClose = () => {
    setVoucherCode('');
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
        {/* Header */}
        <View style={styles().header}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            H3
            
          >
            {t('enterVoucher')}
          </TextDefault>
          <TouchableOpacity
            onPress={handleClose}
            style={styles(currentTheme).closeButton}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={18} color={currentTheme.fontMainColor} />
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <View style={styles(currentTheme).inputContainer}>
          <TextInput
            style={styles(currentTheme).input}
            placeholder={t('voucherCode')}
            placeholderTextColor={currentTheme.fontSecondColor}
            value={voucherCode}
            onChangeText={setVoucherCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={[
            styles(currentTheme).applyButton,
            !voucherCode.trim() && styles(currentTheme).applyButtonDisabled
          ]}
          onPress={handleApply}
          disabled={!voucherCode.trim()}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={voucherCode.trim() ? '#fff' : currentTheme.fontSecondColor}
            bolder
            H5
          >
            {t('apply')}
          </TextDefault>
        </TouchableOpacity>
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
      backgroundColor: props !== null ? props.gray200 : '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputContainer: {
      marginBottom: scale(20)
    },
    input: {
      height: scale(40),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.gray100 : '#F9FAFB',
      paddingHorizontal: scale(16),
      fontSize: scale(16),
      color: props !== null ? props.fontMainColor : '#000',
      fontFamily: 'Poppins-Regular'
    },
    applyButton: {
      height: scale(40),
      borderRadius: scale(8),
      backgroundColor: props !== null ? props.singlevendorcolor : '#0090CD',
      alignItems: 'center',
      justifyContent: 'center'
    },
    applyButtonDisabled: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB'
    }
  });

export default VoucherBottomSheet;
