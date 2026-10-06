import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useScheduleStore from '../../stores/scheduleStore'
import ConfigurationContext from '../../../context/Configuration'
import LoadingSkeleton from '../LoadingSkeleton'
import ClickCollectConfirmModal from './ClickCollectConfirmModal'
import CheckoutSection from './CheckoutSection'
import useCheckoutPalette from './useCheckoutPalette'

const DeliveryTimeOptions = ({ selectedTime, onSelectTime, priorityDeliveryFee, mode = 'delivery', scheduledTime = null }) => {
  console.log('🚀 ~ DeliveryTimeOptions ~ mode:', mode)
  const { clearSchedule } = useScheduleStore()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { palette, isRTL } = useCheckoutPalette()
  const s = styles(palette)
  const configuration = useContext(ConfigurationContext)
  const currencySymbol = configuration?.currencySymbol || '€'

  // State for Click & Collect modal
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pendingSelection, setPendingSelection] = useState(null)
  // Format scheduled time display
  const getScheduleSubtitle = () => {
    if (scheduledTime && scheduledTime.dateLabel && scheduledTime.timeSlot) {
      return `${scheduledTime.dateLabel}, ${scheduledTime.timeSlot.time}`
    }
    return mode === 'delivery' ? t('Choose a delivery time') || 'Choose a delivery time' : t('Choose a collection time') || 'Choose a collection time'
  }

  const timeOptions = [
    {
      id: 'priority',
      title: mode === 'delivery' ? `${t('Priority delivery for') || 'Priority delivery for'} +${priorityDeliveryFee} ${currencySymbol}` : `${t('Priority collection for') || 'Priority collection for'} +${priorityDeliveryFee} ${currencySymbol}`,
      subtitle: t('Your order will be handled with priority') || 'Your order will be handled with priority',
      icon: 'lightning-bolt'
    },
    {
      id: 'standard',
      title: mode === 'collection' ? (t('Immediate') || 'Immediate') : (t('Standard') || 'Standard'),
      subtitle: mode === 'collection' ? (t('2-5 Min abholbereit') || '2-5 Min abholbereit') : (t('under 35 minutes') || 'under 35 minutes'),
      icon: mode === 'collection' ? 'store-clock-outline' : 'clock-fast'
    },
    {
      id: 'schedule',
      title: t('Schedule') || 'Schedule',
      subtitle: getScheduleSubtitle(),
      icon: 'calendar-month-outline'
    }
  ]

  const handleTimeSelect = (optionId) => {
    console.log('🕐 Time Option Selected:', optionId)

    if (optionId === 'schedule') {
      // For schedule option, check if in collection mode
      if (mode === 'collection') {
        // Show modal first for collection mode
        setPendingSelection(optionId)
        setIsModalVisible(true)
      } else {
        // In delivery mode, navigate directly to schedule screen
        console.log('📅 Navigating to Schedule Delivery Time screen')
        navigation.navigate('ScheduleDeliveryTime')
      }
    } else {
      // For standard/priority option
      if (mode === 'collection') {
        // Show modal first for collection mode
        setPendingSelection(optionId)
        setIsModalVisible(true)
      } else {
        // In delivery mode, select directly
        console.log('🗑️ Clearing schedule, switching to:', optionId)
        clearSchedule()
        onSelectTime(optionId)
      }
    }
  }

  const handleModalConfirm = () => {
    console.log('✅ Modal confirmed, selecting:', pendingSelection)

    if (pendingSelection === 'schedule') {
      // Navigate to schedule screen after confirmation
      setIsModalVisible(false)
      console.log('📅 Navigating to Schedule Delivery Time screen')
      navigation.navigate('ScheduleDeliveryTime')
    } else {
      // Clear schedule and update the time for standard option
      clearSchedule()
      onSelectTime(pendingSelection)
      setIsModalVisible(false)
    }

    setPendingSelection(null)
  }

  const handleModalClose = () => {
    console.log('❌ Modal closed without confirmation')
    setIsModalVisible(false)
    setPendingSelection(null)
  }

  return (
    <CheckoutSection icon='clock-outline' title={mode === 'delivery' ? t('Delivery Time') || 'Delivery Time' : t('Collection Time') || 'Collection Time'}>
      <View style={s.optionsList}>
      {timeOptions.map((option) => {
        if (mode === 'collection' && option.id === 'priority') return null
        const isSelected = selectedTime === option.id
        return (
          <TouchableOpacity
            key={option.id}
            style={[s.optionCard, isSelected && s.optionCardSelected]}
            onPress={() => handleTimeSelect(option.id)}
            activeOpacity={0.75}
            accessibilityRole='radio'
            accessibilityState={{ selected: isSelected }}
          >
            <View style={[s.optionIcon, isSelected && s.optionIconSelected]}>
              <MaterialCommunityIcons name={option.icon} size={scale(19)} color={isSelected ? palette.brandText : palette.textSecondary} />
            </View>

            <View style={s.optionContent}>
              {option.id === 'priority' && !priorityDeliveryFee
                ? (
                <View style={{ gap: 4 }}>
                  <LoadingSkeleton height={10} width='100%' borderRadius={8} />
                  <LoadingSkeleton height={8} width='60%' borderRadius={8} />
                </View>
                  )
                : (
                <>
                  <TextDefault textColor={palette.textPrimary} bold bolder={isSelected} isRTL>
                    {option.title}
                  </TextDefault>
                  <TextDefault textColor={palette.textMuted} small isRTL style={s.optionSubtitle}>
                    {option.subtitle}
                  </TextDefault>
                </>
                  )}
              {option.id === 'schedule' && scheduledTime && selectedTime === 'schedule' && (
                <TextDefault textColor={palette.brandText} small bold isRTL style={s.optionSubtitle}>
                  {t('Tap to change') || 'Tap to change'}
                </TextDefault>
              )}
            </View>

            {option.id === 'schedule' && !isSelected
              ? <Feather name={isRTL ? 'chevron-left' : 'chevron-right'} size={scale(18)} color={palette.textMuted} />
              : (
              <View style={[s.radioOuter, isSelected && s.radioOuterSelected]}>{isSelected && <View style={s.radioInner} />}</View>
                )}
          </TouchableOpacity>
        )
      })}
      </View>

      {/* Click & Collect Confirmation Modal */}
      <ClickCollectConfirmModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        selectedOption={pendingSelection}
      />
    </CheckoutSection>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    optionsList: {
      gap: scale(6)
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(52),
      paddingVertical: scale(8),
      paddingHorizontal: scale(10),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface
    },
    optionCardSelected: {
      borderColor: palette.brandBorder,
      backgroundColor: palette.brandSubtle
    },
    optionIcon: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(9),
      backgroundColor: palette.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12)
    },
    optionIconSelected: {
      backgroundColor: palette.surface
    },
    optionContent: {
      flex: 1,
      paddingRight: scale(8)
    },
    optionSubtitle: {
      marginTop: scale(1)
    },
    radioOuter: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: palette.borderStrong,
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioOuterSelected: {
      borderColor: palette.brand
    },
    radioInner: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: palette.brand
    }
  })

export default DeliveryTimeOptions
