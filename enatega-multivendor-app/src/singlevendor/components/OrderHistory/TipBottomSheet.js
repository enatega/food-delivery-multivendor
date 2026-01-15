import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const TipBottomSheet = React.forwardRef(({ onTipSelected, currencySymbol = '€', currentTip = 0 }, ref) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [tipAmount, setTipAmount] = useState('');
  const [selectedPredefinedTip, setSelectedPredefinedTip] = useState(null);

  const predefinedTips = [1, 2, 3, 5];

  useEffect(() => {
    if (currentTip > 0) {
      setTipAmount(currentTip.toString());
    }
  }, [currentTip]);

  const handlePredefinedTip = (amount) => {
    setSelectedPredefinedTip(amount);
    setTipAmount(amount.toString());
  };

  const handleCustomTip = () => {
    setSelectedPredefinedTip('custom');
    // Input field will be focused by user
  };

  const handleInputChange = (text) => {
    // Remove currency symbol and spaces if user types them
    const cleanedText = text.replace(/[^0-9.]/g, '');
    setTipAmount(cleanedText);
    // If user types a custom amount, mark as custom
    if (cleanedText) {
      const amount = parseFloat(cleanedText);
      if (!isNaN(amount) && predefinedTips.includes(amount)) {
        setSelectedPredefinedTip(amount);
      } else {
        setSelectedPredefinedTip('custom');
      }
    } else {
      setSelectedPredefinedTip(null);
    }
  };

  const handleDone = () => {
    const amount = parseFloat(tipAmount);
    if (!isNaN(amount) && amount > 0) {
      onTipSelected(amount);
      ref?.current?.close();
    }
  };

  const handleClose = () => {
    setTipAmount('');
    setSelectedPredefinedTip(null);
    ref?.current?.close();
  };

  const isValidAmount = () => {
    const amount = parseFloat(tipAmount);
    return !isNaN(amount) && amount > 0;
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
            {t('Increase the tip') || 'Increase the tip'}
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
          <View style={styles(currentTheme).inputWrapper}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).currencyPrefix}
              H5
            >
              {currencySymbol}
            </TextDefault>
            <TextInput
              style={styles(currentTheme).input}
              placeholder="1:00"
              placeholderTextColor={currentTheme.fontSecondColor}
              value={tipAmount}
              onChangeText={handleInputChange}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Predefined Tip Buttons */}
        <View style={styles().tipButtonsContainer}>
          {predefinedTips.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles(currentTheme).tipButton,
                selectedPredefinedTip === amount && styles(currentTheme).tipButtonSelected
              ]}
              onPress={() => handlePredefinedTip(amount)}
              activeOpacity={0.7}
            >
              <TextDefault
                textColor={selectedPredefinedTip === amount ? '#fff' : currentTheme.fontMainColor}
                bolder={selectedPredefinedTip === amount}
                H5
              >
                {currencySymbol} {amount}
              </TextDefault>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles(currentTheme).customTipButton,
              styles(currentTheme).tipButtonLast
            ]}
            onPress={handleCustomTip}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={currentTheme.fontMainColor}
              H5
            >
              + {t('Custom') || 'Custom'}
            </TextDefault>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={[
            styles(currentTheme).doneButton,
            !isValidAmount() && styles(currentTheme).doneButtonDisabled
          ]}
          onPress={handleDone}
          disabled={!isValidAmount()}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={isValidAmount() ? '#fff' : currentTheme.fontSecondColor}
            bolder
            H5
          >
            {t('Done') || 'Done'}
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
      backgroundColor: props !== null ? props.colorBgTertiary : '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputContainer: {
      marginBottom: scale(20)
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      height: scale(40),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.colorBgTertiary : '#F9FAFB',
      paddingHorizontal: scale(16)
    },
    currencyPrefix: {
      marginRight: scale(8)
    },
    input: {
      flex: 1,
      fontSize: scale(16),
      color: props !== null ? props.fontMainColor : '#000',
      fontFamily: 'Poppins-Regular',
      padding: 0
    },
    tipButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scale(24)
    },
    tipButton: {
      flex: 1,
      height: scale(40),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(8)
    },
    tipButtonLast: {
      marginRight: 0,
    },
    tipButtonSelected: {
      backgroundColor: props !== null ? props.singlevendorcolor : '#0090CD',
      borderColor: props !== null ? props.singlevendorcolor : '#0090CD'
    },
    customTipButton: {
      flex: 1,
      height: scale(40),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(8)
    },
    doneButton: {
      height: scale(40),
      borderRadius: scale(8),
      backgroundColor: props !== null ? props.singlevendorcolor : '#0090CD',
      alignItems: 'center',
      justifyContent: 'center'
    },
    doneButtonDisabled: {
      backgroundColor: props !== null ? props.colorBgTertiary : '#E5E7EB'
    }
  });

export default TipBottomSheet;
