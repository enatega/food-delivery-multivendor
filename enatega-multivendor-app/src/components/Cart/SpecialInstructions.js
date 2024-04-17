import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import InstructionMessageIcon from '../../assets/SVG/instructions-message-icon'
import ArrowForwardIcon from '../../assets/SVG/arrow-forward-icon'
import { useStyles } from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { InstructionsModal } from './InstructionsModal'

export const SpecialInstructions = ({ theme }) => {
    const styles = useStyles(theme)
    return (<View style={{ height: 100, flex: 1, flexDirection: 'row' }}>
        <View left style={styles.iconContainer}>
            <InstructionMessageIcon />
        </View>
        <View middle style={{ flex: 6, justifyContent: 'center' }}>
            <TextDefault H5 bolder>Add a message for the restaurant</TextDefault>
            <TextDefault textColor={theme.fontNewColor} style={{ lineHeight: scale(18) }}>Special requests, allergies, dietary restriction</TextDefault>
        </View>
        <TouchableOpacity right style={styles.iconContainer}>
            <ArrowForwardIcon />
        </TouchableOpacity>
        <InstructionsModal theme={theme}/>
    </View>)
}