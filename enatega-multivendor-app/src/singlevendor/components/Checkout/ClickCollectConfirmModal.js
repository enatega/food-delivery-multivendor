import React from 'react'
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import useCheckoutPalette from './useCheckoutPalette'

const ClickCollectConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  selectedOption // 'standard' (immediate) or 'schedule'
}) => {
  const { t } = useTranslation()
  const { palette } = useCheckoutPalette()

  const getModalContent = () => {
    if (selectedOption === 'standard') {
      // For immediate pickup
      return {
        title: t('Immediate Pickup') || 'Immediate Pickup',
        content: t('It takes 2–5 minutes after order placement for your order to be prepared.\n\nWe reserve the right to cancel Click & Collect orders if they are not picked up within two hours after payment, or if the order is placed shortly before the end of business hours.')
      }
    } else if (selectedOption === 'schedule') {
      // For scheduled pickup
      return {
        title: t('Scheduled Pickup') || 'Scheduled Pickup',
        content: t('We reserve the right to cancel Click & Collect orders if they are not picked up within two hours after the scheduled time, or if the order is placed shortly before the end of business hours.')
      }
    }
    return { title: '', content: '' }
  }

  const { title, content } = getModalContent()
  const themedStyles = styles(palette)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={themedStyles.modalOverlay}>
        <TouchableOpacity
          style={themedStyles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={themedStyles.modalContent}>
          <View style={themedStyles.handle} />

          {/* Header */}
          <View style={themedStyles.header}>
            <View style={themedStyles.headerSpacer} />
            <View style={themedStyles.headerIcon}>
              <MaterialCommunityIcons name={selectedOption === 'schedule' ? 'calendar-clock-outline' : 'shopping-outline'} size={scale(22)} color={palette.brandText} />
            </View>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={themedStyles.closeButton}
            >
              <AntDesign name="close" size={18} color={palette.textPrimary} />
            </TouchableOpacity>
          </View>
          <TextDefault
            textColor={palette.textPrimary}
            bolder
            H4
            isRTL
            style={themedStyles.headerTitle}
          >
            {title}
          </TextDefault>

          {/* Content */}
          <ScrollView style={themedStyles.contentContainer} showsVerticalScrollIndicator={false}>
            <TextDefault
              textColor={palette.textSecondary}
              Normal
              isRTL
              style={themedStyles.contentText}
            >
              {content}
            </TextDefault>
          </ScrollView>

          {/* Separator Line */}
          <View style={themedStyles.separator} />

          {/* Confirm Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={themedStyles.confirmButton}
            onPress={onConfirm}
          >
            <TextDefault
              textColor={palette.onBrand}
              bolder
              H4
            >
              {t('Confirm') || 'Confirm'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: palette.overlay
    },
    modalBackdrop: {
      flex: 1
    },
    modalContent: {
      backgroundColor: palette.surface,
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 0,
      borderColor: palette.border,
      paddingHorizontal: scale(20),
      paddingTop: scale(10),
      paddingBottom: scale(34)
    },
    handle: {
      alignSelf: 'center',
      width: scale(40),
      height: scale(4),
      borderRadius: scale(2),
      backgroundColor: palette.borderStrong,
      marginBottom: scale(12)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(12)
    },
    headerSpacer: {
      width: 36
    },
    headerIcon: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
      backgroundColor: palette.brandSubtle,
      alignItems: 'center',
      justifyContent: 'center'
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerTitle: {
      textAlign: 'center',
      marginBottom: scale(10)
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
      height: StyleSheet.hairlineWidth,
      backgroundColor: palette.border,
      marginHorizontal: -scale(20),
      marginBottom: scale(16)
    },
    confirmButton: {
      backgroundColor: palette.brand,
      minHeight: scale(52),
      borderRadius: scale(14),
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export default ClickCollectConfirmModal
