import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import InstructionMessageIcon from '../../assets/SVG/instructions-message-icon'
import ArrowForwardIcon from '../../assets/SVG/arrow-forward-icon'
import { useStyles } from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { InstructionsModal } from './InstructionsModal'

export const SpecialInstructions = ({ theme, instructions, onSubmitInstructions }) => {
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

    return (<View style={{ height: 100, flex: 1, flexDirection: 'row' }}>
        <View left style={styles.iconContainer}>
            <InstructionMessageIcon stroke={theme.iconStroke}/>
        </View>
        <View middle style={{ flex: 6, justifyContent: 'center' }}>
            <TextDefault H5 bolder>Add a message for the restaurant</TextDefault>
            <TextDefault numberOfLines={3} textColor={theme.fontNewColor} style={{ lineHeight: scale(18) }}>{instructions || 'Special requests, allergies, dietary restriction'}</TextDefault>
        </View>
        <TouchableOpacity right style={styles.iconContainer} onPress={showModal}>
            <ArrowForwardIcon stroke={theme.iconStroke}/>
        </TouchableOpacity>
        <InstructionsModal theme={theme} isVisible={isVisible} hideModal={hideModal} onSubmit={onSubmit} value={value} setValue={setValue} />
    </View>)
}