import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { scale } from '../../../utils/scaling';
import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import { theme } from '../../../utils/themeColors';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import { useTranslation } from 'react-i18next';

const OrderFeesModal = ({ 
  visible, 
  onClose, 
  minimumOrder = 10,
  lowOrderFeeThreshold = 15,
  lowOrderFee = 2,
  currencySymbol = '€'
}) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

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
              Order fees & minimum spend
            </TextDefault>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <AntDesign name="close" size={24} color={currentTheme.fontMainColor} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles().descriptionContainer}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              Normal
              isRTL
              style={styles().descriptionText}
            >
              The minimum spend is{' '}
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                Normal
              >
                {currencySymbol}{minimumOrder}
              </TextDefault>
              {' '}total cart value.
            </TextDefault>
          </View>

          {/* Fee Table */}
          <View style={styles().table}>
            {/* Header Row */}
            <View style={styles().tableRow}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                H5
                isRTL
                style={styles().tableCell}
              >
                Total cart value
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                H5
                isRTL
                style={styles().tableCellRight}
              >
                Service fee
              </TextDefault>
            </View>

            {/* Row 1 */}
            <View style={[styles().tableRow, styles().tableRowData]}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                Normal
                isRTL
                style={styles().tableCell}
              >
                {currencySymbol}{minimumOrder}:00 - {currencySymbol}{(lowOrderFeeThreshold - 0.01).toFixed(2)}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                Normal
                isRTL
                style={styles().tableCellRight}
              >
                {currencySymbol}{lowOrderFee}:00
              </TextDefault>
            </View>

            {/* Row 2 */}
            <View style={[styles().tableRow, styles().tableRowData]}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                Normal
                isRTL
                style={styles().tableCell}
              >
                {currencySymbol}{lowOrderFeeThreshold} - & above
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                Normal
                isRTL
                style={styles().tableCellRight}
              >
                No Fee
              </TextDefault>
            </View>
          </View>

          {/* Footer Note */}
          <View style={styles().footerNoteContainer}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              small
              isRTL
              style={styles().footerNote}
            >
              * For orders less than{' '}
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                bolder
                small
              >
                {currencySymbol}{lowOrderFeeThreshold}
              </TextDefault>
              {' '}a small order fee of{' '}
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                bolder
                small
              >
                {currencySymbol}{lowOrderFee}
              </TextDefault>
              {' '}applies
            </TextDefault>
          </View>

          {/* OK Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).okButton}
            onPress={onClose}
          >
            <TextDefault
              textColor="#fff"
              bolder
              H4
            >
              OK
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
      width: 24
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center'
    },
    descriptionContainer: {
      marginBottom: scale(24),
      alignItems: 'center'
    },
    descriptionText: {
      textAlign: 'center'
    },
    description: {
      marginBottom: scale(24),
      textAlign: "center"
    },
    table: {
      marginBottom: scale(20)
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: scale(12)
    },
    tableRowData: {
      borderTopWidth: 1,
      borderTopColor: currentTheme ? currentTheme.gray200 : '#E5E7EB'
    },
    tableCell: {
      flex: 1
    },
    tableCellRight: {
      flex: 1,
      textAlign: 'right'
    },
    footerNoteContainer: {
      marginBottom: scale(24),
      alignItems: 'center'
    },
    footerNote: {
      lineHeight: scale(20),
      textAlign: 'center'
    },
    okButton: {
      backgroundColor: '#0EA5E9',
      paddingVertical: scale(16),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default OrderFeesModal;
