import React, { useContext, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ConfigurationContext from '../../../context/Configuration'
import CheckoutSection from './CheckoutSection'
import useCheckoutPalette from './useCheckoutPalette'

const TipSection = ({ selectedTip, onSelectTip }) => {
  const { t } = useTranslation()
  const { palette, isRTL } = useCheckoutPalette()
  const s = styles(palette)
  const configurations = useContext(ConfigurationContext)
  const currencySymbol = configurations.currencySymbol

  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const tipOptions = [1, 2, 3, 5]
  const MIN_TIP_AMOUNT = 0.5
  const MAX_TIP_AMOUNT = 50
  const numericCustomAmount = parseFloat(customAmount)
  const belowMinTip = !isNaN(numericCustomAmount) && numericCustomAmount > 0 && numericCustomAmount < MIN_TIP_AMOUNT
  const exceedsMaxTip = !isNaN(numericCustomAmount) && numericCustomAmount > MAX_TIP_AMOUNT
  const isInvalidTip = belowMinTip || exceedsMaxTip

  const handleCustomTip = () => {
    if (customAmount === '') {
      onSelectTip(0)
      setShowCustomModal(false)
      setCustomAmount('')
      return
    }

    const amount = parseFloat(customAmount)
    if (!isNaN(amount) && amount === 0) {
      onSelectTip(0)
      setShowCustomModal(false)
      setCustomAmount('')
      return
    }

    if (!isNaN(amount) && amount >= MIN_TIP_AMOUNT && amount <= MAX_TIP_AMOUNT) {
      onSelectTip(amount)
      setShowCustomModal(false)
      // setCustomAmount('')
    }
  }

  const isCustomSelected = !tipOptions.includes(selectedTip) && selectedTip > 0

  return (
    <CheckoutSection icon='hand-heart-outline' title={t('Tip your courier') || 'Tip your courier'} subtitle={t('The tip will be paid full to the courier.') || 'The tip will be paid full to the courier.'}>
      <View style={s.tipOptionsContainer}>
        {tipOptions.map((amount) => {
          const isSelected = selectedTip === amount
          return (
            <TouchableOpacity key={amount} style={[s.tipButton, isSelected && s.tipButtonSelected]} onPress={() => onSelectTip(amount)} activeOpacity={0.75}>
              <TextDefault textColor={isSelected ? palette.onBrand : palette.textPrimary} bold bolder={isSelected} isRTL numberOfLines={1}>
                {currencySymbol} {amount}
              </TextDefault>
            </TouchableOpacity>
          )
        })}

        <TouchableOpacity style={[s.tipButton, s.customButton, isCustomSelected && s.tipButtonSelected]} onPress={() => setShowCustomModal(true)} activeOpacity={0.75}>
          <TextDefault textColor={isCustomSelected ? palette.onBrand : palette.textPrimary} bold bolder={isCustomSelected} isRTL numberOfLines={1}>
            {isCustomSelected ? `${currencySymbol} ${selectedTip}` : `+ ${t('Custom') || 'Custom'}`}
          </TextDefault>
        </TouchableOpacity>
      </View>

      {/* Custom Tip Modal */}
      <Modal visible={showCustomModal} transparent animationType='fade' onRequestClose={() => setShowCustomModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalIcon}>
              <Feather name='heart' size={scale(20)} color={palette.brandText} />
            </View>
            <TextDefault textColor={palette.textPrimary} bolder H5 isRTL style={s.modalTitle}>
              {t('Enter custom tip amount') || 'Enter custom tip amount'}
            </TextDefault>

            <TextInput
              style={[s.customInput, isRTL && s.inputRTL, isInvalidTip && s.customInputError]}
              placeholder={`${currencySymbol} 0.00`}
              placeholderTextColor={palette.textMuted}
              selectionColor={palette.brand}
              keyboardType='decimal-pad'
              maxLength={2}
              value={customAmount}
              onChangeText={(text) => {
                const sanitized = text.replace(/[^0-9.]/g, '')
                const parts = sanitized.split('.')
                const cleaned = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized
                setCustomAmount(cleaned)
              }}
            />
            {isInvalidTip && (
              <TextDefault textColor={palette.danger} small isRTL style={s.errorText}>
                {belowMinTip
                  ? `${t('Tip must be at least')} ${currencySymbol}${MIN_TIP_AMOUNT}.`
                  : `${t('Tip cannot exceed')} ${currencySymbol}${MAX_TIP_AMOUNT}. ${t('Please enter a lower amount.')}`}
              </TextDefault>
            )}

            <View style={s.modalButtons}>
              <TouchableOpacity
                style={[s.modalButton, s.modalButtonCancel]}
                onPress={() => {
                  setShowCustomModal(false)
                  // setCustomAmount('')
                }}
                activeOpacity={0.7}
              >
                <TextDefault textColor={palette.textPrimary} bolder isRTL>
                  {t('Cancel') || 'Cancel'}
                </TextDefault>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.modalButton, s.modalButtonConfirm, isInvalidTip && s.modalButtonDisabled]}
                onPress={handleCustomTip}
                activeOpacity={0.7}
                disabled={isInvalidTip}
              >
                <TextDefault textColor={palette.onBrand} bolder isRTL>
                  {t('Confirm') || 'Confirm'}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CheckoutSection>
  )
}

const styles = (palette) =>
  StyleSheet.create({
    tipOptionsContainer: {
      flexDirection: 'row',
      gap: scale(8)
    },
    tipButton: {
      flex: 1,
      minHeight: scale(40),
      paddingHorizontal: scale(4),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center'
    },
    customButton: {
      flex: 1.6
    },
    tipButtonSelected: {
      backgroundColor: palette.brand,
      borderColor: palette.brand
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: palette.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(20)
    },
    modalContent: {
      backgroundColor: palette.surface,
      borderRadius: scale(20),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      padding: scale(20),
      width: '100%',
      maxWidth: scale(400)
    },
    modalIcon: {
      alignSelf: 'center',
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      backgroundColor: palette.brandSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(12)
    },
    modalTitle: {
      marginBottom: scale(16),
      textAlign: 'center'
    },
    customInput: {
      height: scale(50),
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: scale(12),
      paddingHorizontal: scale(16),
      fontSize: scale(18),
      fontWeight: '600',
      textAlign: 'center',
      color: palette.textPrimary,
      backgroundColor: palette.surfaceMuted,
      marginBottom: scale(16)
    },
    inputRTL: {
      writingDirection: 'rtl'
    },
    customInputError: {
      borderColor: palette.danger,
      marginBottom: scale(6)
    },
    errorText: {
      marginBottom: scale(14),
      textAlign: 'center'
    },
    modalButtons: {
      flexDirection: 'row',
      gap: scale(12)
    },
    modalButton: {
      flex: 1,
      minHeight: scale(48),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalButtonCancel: {
      borderWidth: 1,
      borderColor: palette.borderStrong,
      backgroundColor: palette.surface
    },
    modalButtonConfirm: {
      backgroundColor: palette.brand
    },
    modalButtonDisabled: {
      opacity: 0.5
    }
  })

export default TipSection
