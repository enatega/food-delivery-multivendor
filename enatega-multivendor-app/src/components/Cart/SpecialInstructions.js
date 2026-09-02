import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import InstructionMessageIcon from '../../assets/SVG/instructions-message-icon'
import ArrowForwardIcon from '../../assets/SVG/arrow-forward-icon'
import { useStyles } from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { InstructionsModal } from './InstructionsModal'

export const SpecialInstructions = ({ theme, instructions, onSubmitInstructions, t }) => {
    const [value, setValue] = useState(instructions)
    const [isVisible, setIsVisible] = useState(false)
    const hideModal = _ => {
        setIsVisible(false)
    }
    const showModal = _ => {
        setIsVisible(true)
    }

    const onSubmit = _ => {
        onSubmitInstructions(value)
        hideModal()
    }

    const styles = useStyles(theme)

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.instructionRow}
        onPress={showModal}
      >
        <View style={styles.leadingIcon}>
          <InstructionMessageIcon stroke={theme.colors?.iconMuted || theme.iconStroke}/>
        </View>
        <View style={styles.instructionCopy}>
          <TextDefault H5 bolder isRTL textColor={theme.colors?.textPrimary}>
            {t('AddMessageforRestaurant')}
          </TextDefault>
          <TextDefault
            numberOfLines={2}
            textColor={theme.colors?.textSecondary || theme.fontNewColor}
            isRTL
            style={styles.instructionCaption}
          >
            {instructions || t('specialRequest')}
          </TextDefault>
        </View>
        <View style={styles.trailingIcon}>
          <ArrowForwardIcon stroke={theme.colors?.iconMuted || theme.iconStroke}/>
        </View>
        <InstructionsModal theme={theme} isVisible={isVisible} hideModal={hideModal} onSubmit={onSubmit} value={value} setValue={setValue} t={t} />
      </TouchableOpacity>
    )
}
