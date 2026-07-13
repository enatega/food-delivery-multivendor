import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useScheduleStore from '../../stores/scheduleStore'
import ConfigurationContext from '../../../context/Configuration'
import LoadingSkeleton from '../LoadingSkeleton'
import ClickCollectConfirmModal from './ClickCollectConfirmModal'

const DeliveryTimeOptions = ({ selectedTime, onSelectTime, priorityDeliveryFee, mode = 'delivery', scheduledTime = null }) => {
  console.log("🚀 ~ DeliveryTimeOptions ~ mode:", mode)
  const { clearSchedule } = useScheduleStore()
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
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
      subtitle: t('Your order will be handled with priority') || 'Your order will be handled with priority'
    },
    {
      id: 'standard',
      title: mode === 'collection' ? (t('Immediate') || 'Immediate') : (t('Standard') || 'Standard'),
      subtitle: mode === 'collection' ? (t('2-5 Min abholbereit') || '2-5 Min abholbereit') : (t('under 35 minutes') || 'under 35 minutes')
    },
    {
      id: 'schedule',
      title: t('Schedule') || 'Schedule',
      subtitle: getScheduleSubtitle()
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
    <View style={styles(currentTheme).container}>
      <TextDefault textColor={currentTheme.fontMainColor} bolder H4 isRTL style={styles().sectionTitle}>
        {mode === 'delivery' ? t('Delivery Time') || 'Delivery Time' : t('Collection Time') || 'Collection Time'}
      </TextDefault>

      {timeOptions.map((option) => {
        if(mode === 'collection' && option.id === 'priority') return null
        return (
          <TouchableOpacity key={option.id} style={[styles(currentTheme).optionCard, selectedTime === option.id && styles(currentTheme).optionCardSelected]} onPress={() => handleTimeSelect(option.id)} activeOpacity={0.7}>
            <View style={styles().radioButton}>
              <View style={[styles(currentTheme).radioOuter, selectedTime === option.id && styles(currentTheme).radioOuterSelected]}>{selectedTime === option.id && <View style={styles(currentTheme).radioInner} />}</View>
            </View>

            <View style={styles().optionContent}>
              {option.id === 'priority' && !priorityDeliveryFee ? (
                <>
                  <View style={{ gap: 4 }}>
                    <LoadingSkeleton height={10} width='100%' borderRadius={8} />
                    <LoadingSkeleton height={8} width='60%' borderRadius={8} />
                  </View>
                </>
              ) : (
                <>
                  <TextDefault textColor={currentTheme.fontMainColor} bold bolder={selectedTime === option.id} isRTL>
                    {option.title}
                  </TextDefault>
                  <TextDefault textColor={currentTheme.fontSecondColor} small isRTL>
                    {option.subtitle}
                  </TextDefault>
                </>
              )}
              {option.id === 'schedule' && scheduledTime && selectedTime === 'schedule' && (
                <TextDefault textColor={currentTheme.primaryBlue || '#0EA5E9'} small isRTL style={{ marginTop: scale(2) }}>
                  {t('Tap to change') || 'Tap to change'}
                </TextDefault>
              )}
            </View>

            {/* Checkmark icon for selected option */}
            {selectedTime === option.id && <Feather name='check-circle' size={20} color={currentTheme.primaryBlue || '#0EA5E9'} style={styles().checkIcon} />}
          </TouchableOpacity>
        )
      })}

      {/* Click & Collect Confirmation Modal */}
      <ClickCollectConfirmModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        selectedOption={pendingSelection}
      />
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16)
    },
    sectionTitle: {
      marginBottom: scale(12)
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(8),
      paddingHorizontal: scale(16),
      marginBottom: scale(8),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    optionCardSelected: {
      borderColor: props !== null ? props.primaryBlue : '#0EA5E9',
      borderWidth: 2,
      backgroundColor: props !== null ? props.colorBgSecondary || 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.08)'
    },
    radioButton: {
      marginRight: scale(12)
    },
    radioOuter: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      borderWidth: 2,
      borderColor: props !== null ? props.gray300 : '#D1D5DB',
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioOuterSelected: {
      borderColor: props !== null ? props.primaryBlue : '#0EA5E9'
    },
    radioInner: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9'
    },
    optionContent: {
      flex: 1
    },
    checkIcon: {
      marginLeft: scale(8)
    }
  })

export default DeliveryTimeOptions
