import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { useTranslation } from 'react-i18next';

const ClickCollectConfirmModal = ({ 
  visible, 
  onClose,
  onConfirm,
  selectedOption // 'standard' (immediate) or 'schedule'
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const getModalContent = () => {
    if (selectedOption === 'standard') {
      // For immediate pickup
      return {
        title: t('Immediate Pickup') || 'Immediate Pickup',
        content: t('It takes 2–5 minutes after order placement for your order to be prepared.\n\nFast reserves the right to cancel Click & Collect orders if they are not picked up within two hours after payment, or if the order is placed shortly before the end of business hours.') || 
                 'It takes 2–5 minutes after order placement for your order to be prepared.\n\nFast reserves the right to cancel Click & Collect orders if they are not picked up within two hours after payment, or if the order is placed shortly before the end of business hours.'
      };
    } else if (selectedOption === 'schedule') {
      // For scheduled pickup
      return {
        title: t('Scheduled Pickup') || 'Scheduled Pickup',
        content: t('Fast reserves the right to cancel Click & Collect orders if they are not picked up within two hours after scheduled time, or if the order is placed shortly before the end of business hours.') ||
                 'Enatega reserves the right to cancel Click & Collect orders if they are not picked up within two hours after scheduled time, or if the order is placed shortly before the end of business hours.'
      };
    }
    return { title: '', content: '' };
  };

  const { title, content } = getModalContent();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles().modalOverlay}>
        <TouchableOpacity 
          style={styles().modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles(currentTheme).modalContent}>
          {/* Header */}
          <View style={styles().header}>
            <View style={styles().headerSpacer} />
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H4
              isRTL
              style={styles().headerTitle}
            >
              {title}
            </TextDefault>
            <TouchableOpacity 
              onPress={onClose} 
              activeOpacity={0.7}
              style={styles(currentTheme).closeButton}
            >
              <AntDesign name="close" size={20} color={currentTheme.fontMainColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles().contentContainer} showsVerticalScrollIndicator={false}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              Normal
              isRTL
              style={styles().contentText}
            >
              {content}
            </TextDefault>
          </ScrollView>

          {/* Separator Line */}
          <View style={styles(currentTheme).separator} />

          {/* Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).confirmButton}
            onPress={onConfirm}
          >
            <TextDefault
              textColor="#fff"
              bolder
              H4
            >
              {t('Confirm') || 'Confirm'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = (currentTheme = null) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalBackdrop: {
      flex: 1
    },
    modalContent: {
      backgroundColor: currentTheme ? currentTheme.themeBackground : '#fff',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(40)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(16)
    },
    headerSpacer: {
      width: 36
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: currentTheme ? currentTheme.gray100 : '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center'
    },
    contentContainer: {
      maxHeight: scale(300),
      marginBottom: scale(20)
    },
    contentText: {
      textAlign: 'center',
      lineHeight: scale(22)
    },
    separator: {
      height: 1,
      backgroundColor: currentTheme ? currentTheme.gray200 : '#E5E7EB',
      marginHorizontal: -scale(20),
      marginBottom: scale(16)
    },
    confirmButton: {
      backgroundColor: '#0EA5E9',
      paddingVertical: scale(12),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default ClickCollectConfirmModal;
