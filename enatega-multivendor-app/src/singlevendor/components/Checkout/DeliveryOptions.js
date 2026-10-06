import React, { useState } from 'react'
import { View, TouchableOpacity, TextInput, StyleSheet, Switch } from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import CheckoutSection from './CheckoutSection'
import useCheckoutPalette from './useCheckoutPalette'

const DeliveryOptions = ({
  deliveryAddress,
  onSelectAddress,
  showLeaveAtDoor = true,
  leaveAtDoor,
  onToggleLeaveAtDoor,
  callOnArrival,
  onToggleCallOnArrival,
  courierInstructions,
  onChangeCourierInstructions
}) => {
  const { t } = useTranslation()
  const { palette, isRTL } = useCheckoutPalette()
  const [instructionsFocused, setInstructionsFocused] = useState(false)
  const s = styles(palette)

  const switchProps = {
    trackColor: { false: palette.switchOff, true: palette.brand },
    ios_backgroundColor: palette.switchOff,
    thumbColor: '#FFFFFF',
    style: s.switch
  }

  return (
    <CheckoutSection bodyStyle={s.body}>
      {/* Address Selection */}
      <TouchableOpacity style={s.row} onPress={onSelectAddress} activeOpacity={0.7}>
        <View style={[s.iconBadge, s.iconBadgeBrand]}>
          <MaterialCommunityIcons name='map-marker-outline' size={scale(20)} color={palette.brandText} />
        </View>
        <View style={s.rowContent}>
          <TextDefault textColor={palette.textPrimary} bolder isRTL>
            {t('Choose a delivery address') || 'Choose a delivery address'}
          </TextDefault>
          <TextDefault textColor={deliveryAddress?.deliveryAddress ? palette.textSecondary : palette.textMuted} small isRTL numberOfLines={2} style={s.rowSubtitle}>
            {deliveryAddress?.deliveryAddress || (t('Tap here to continue') || 'Tap here to continue')}
          </TextDefault>
        </View>
        <View style={s.chevron}>
          <Feather name={isRTL ? 'chevron-left' : 'chevron-right'} size={scale(18)} color={palette.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* Leave at the door (hidden for cash on delivery) */}
      {showLeaveAtDoor && (
        <>
          <View style={s.divider} />
          <View style={s.row}>
            <View style={s.iconBadge}>
              <MaterialCommunityIcons name='door-closed' size={scale(19)} color={palette.textSecondary} />
            </View>
            <View style={s.rowContent}>
              <TextDefault textColor={palette.textPrimary} bold isRTL>
                {t('Leave at the door') || 'Leave at the door'}
              </TextDefault>
              <TextDefault textColor={palette.textMuted} small isRTL style={s.rowSubtitle}>
                {t('After drop-off, responsibility for the delivery and the condition of the goods passes to the customer.')}
              </TextDefault>
            </View>
            <Switch value={leaveAtDoor} onValueChange={onToggleLeaveAtDoor} {...switchProps} />
          </View>
        </>
      )}

      {/* Call when you arrive */}
      <View style={s.divider} />
      <View style={s.row}>
        <View style={s.iconBadge}>
          <Feather name='phone-call' size={scale(17)} color={palette.textSecondary} />
        </View>
        <View style={s.rowContent}>
          <TextDefault textColor={palette.textPrimary} bold isRTL>
            {t('Call when you arrive') || 'Call when you arrive'}
          </TextDefault>
        </View>
        <Switch value={callOnArrival} onValueChange={onToggleCallOnArrival} {...switchProps} />
      </View>

      {/* Instructions for courier */}
      <View style={[s.instructionsField, instructionsFocused && s.instructionsFieldFocused]}>
        <Feather name='message-square' size={scale(17)} color={instructionsFocused ? palette.brandText : palette.textMuted} />
        <TextInput
          style={[s.instructionsInput, isRTL && s.inputRTL]}
          placeholder={courierInstructions ? '' : (t('Instructions for the courier') || 'Instructions for the courier')}
          placeholderTextColor={palette.textMuted}
          selectionColor={palette.brand}
          value={courierInstructions}
          onChangeText={onChangeCourierInstructions}
          onFocus={() => setInstructionsFocused(true)}
          onBlur={() => setInstructionsFocused(false)}
          multiline={false}
        />
      </View>
    </CheckoutSection>
  )
}

const ICON_SIZE = scale(34)

const styles = (palette) =>
  StyleSheet.create({
    body: {
      marginVertical: -scale(6)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(8)
    },
    iconBadge: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: scale(10),
      backgroundColor: palette.iconBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconBadgeBrand: {
      backgroundColor: palette.brandSubtle
    },
    rowContent: {
      flex: 1,
      marginHorizontal: scale(12)
    },
    rowSubtitle: {
      marginTop: scale(2)
    },
    chevron: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: palette.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center'
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: palette.border,
      marginLeft: ICON_SIZE + scale(12)
    },
    switch: {
      transform: [{ scaleX: 0.86 }, { scaleY: 0.86 }]
    },
    instructionsField: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: scale(44),
      marginTop: scale(6),
      marginBottom: scale(6),
      paddingHorizontal: scale(14),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surfaceMuted
    },
    instructionsFieldFocused: {
      borderColor: palette.brandBorder,
      backgroundColor: palette.surface
    },
    instructionsInput: {
      flex: 1,
      marginLeft: scale(10),
      fontSize: scale(14),
      color: palette.textPrimary,
      height: scale(42),
      paddingVertical: 0,
      paddingHorizontal: 0
    },
    inputRTL: {
      textAlign: 'right'
    }
  })

export default DeliveryOptions
