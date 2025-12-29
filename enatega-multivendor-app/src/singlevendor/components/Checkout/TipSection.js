import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

const TipSection = ({ selectedTip, onSelectTip, currencySymbol = '€' }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const tipOptions = [1, 2, 3, 5];

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onSelectTip(amount);
      setShowCustomModal(false);
      setCustomAmount('');
    }
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
        {t('Tip your courier') || 'Tip your courier'}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.fontSecondColor}
        small
        isRTL
        style={styles().subtitle}
      >
        {t('The tip will be paid full to the courier.') || 'The tip will be paid full to the courier.'}
      </TextDefault>

      <View style={styles().tipOptionsContainer}>
        {tipOptions.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles(currentTheme).tipButton,
              selectedTip === amount && styles(currentTheme).tipButtonSelected
            ]}
            onPress={() => onSelectTip(amount)}
            activeOpacity={0.7}
          >
            <TextDefault
              textColor={selectedTip === amount ? '#fff' : currentTheme.fontMainColor}
              bold
              bolder={selectedTip === amount}
              isRTL
            >
              {currencySymbol} {amount}
            </TextDefault>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles(currentTheme).tipButton,
            !tipOptions.includes(selectedTip) && selectedTip > 0 && styles(currentTheme).tipButtonSelected
          ]}
          onPress={() => setShowCustomModal(true)}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={!tipOptions.includes(selectedTip) && selectedTip > 0 ? '#fff' : currentTheme.fontMainColor}
            bold
            bolder={!tipOptions.includes(selectedTip) && selectedTip > 0}
            isRTL
          >
            + {t('Custom') || 'Custom'}
          </TextDefault>
        </TouchableOpacity>
      </View>

      {/* Custom Tip Modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles().modalOverlay}>
          <View style={styles(currentTheme).modalContent}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              H5
              isRTL
              style={styles().modalTitle}
            >
              {t('Enter custom tip amount') || 'Enter custom tip amount'}
            </TextDefault>

            <TextInput
              style={styles(currentTheme).customInput}
              placeholder={`${currencySymbol} 0.00`}
              placeholderTextColor={currentTheme.fontSecondColor}
              keyboardType="decimal-pad"
              value={customAmount}
              onChangeText={setCustomAmount}
            />

            <View style={styles().modalButtons}>
              <TouchableOpacity
                style={[styles(currentTheme).modalButton, styles().modalButtonCancel]}
                onPress={() => {
                  setShowCustomModal(false);
                  setCustomAmount('');
                }}
                activeOpacity={0.7}
              >
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  bold
                  isRTL
                >
                  {t('Cancel') || 'Cancel'}
                </TextDefault>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles(currentTheme).modalButton, styles(currentTheme).modalButtonConfirm]}
                onPress={handleCustomTip}
                activeOpacity={0.7}
              >
                <TextDefault
                  textColor="#fff"
                  bold
                  isRTL
                >
                  {t('Confirm') || 'Confirm'}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      marginBottom: scale(4)
    },
    subtitle: {
      marginBottom: scale(12)
    },
    tipOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // gap: scale(8)
      justifyContent: 'space-between'
    },
    tipButton: {
      paddingVertical: scale(6),
      paddingHorizontal: scale(12),
      borderRadius: scale(4),
      borderWidth: 1,
      borderColor: props !== null ? props.gray300 : '#D1D5DB',
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    tipButtonSelected: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9',
      borderColor: props !== null ? props.primaryBlue : '#0EA5E9'
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(20)
    },
    modalContent: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      borderRadius: scale(12),
      padding: scale(20),
      width: '100%',
      maxWidth: scale(400)
    },
    modalTitle: {
      marginBottom: scale(16),
      textAlign: 'center'
    },
    customInput: {
      borderWidth: 1,
      borderColor: props !== null ? props.gray300 : '#D1D5DB',
      borderRadius: scale(8),
      paddingVertical: scale(12),
      paddingHorizontal: scale(16),
      fontSize: scale(16),
      color: props !== null ? props.fontMainColor : '#000',
      marginBottom: scale(16)
    },
    modalButtons: {
      flexDirection: 'row',
      gap: scale(12)
    },
    modalButton: {
      flex: 1,
      paddingVertical: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalButtonCancel: {
      borderWidth: 1,
      borderColor: props !== null ? props.gray300 : '#D1D5DB'
    },
    modalButtonConfirm: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9'
    }
  });

export default TipSection;
