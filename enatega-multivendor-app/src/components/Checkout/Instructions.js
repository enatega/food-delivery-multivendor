import React from 'react'
import { View } from 'react-native'
import InstructionMessageIcon from '../../assets/SVG/instructions-message-icon'
import { useStyles } from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'

export const Instructions = ({ theme, title, message }) => {
    const { t } = useTranslation()
    if (!message) return null;
    const styles = useStyles(theme)
    return (<View style={styles.instructionContainer}>
        <View style={styles.leftContainer}><InstructionMessageIcon stroke={theme.iconStroke} /></View>
        <View style={styles.middleContainer}>
            <TextDefault textColor={theme.color11} H5 bold isRTL>{t(title)}</TextDefault>
            <TextDefault numberOfLines={3} H5 bold isRTL>{message}</TextDefault>
        </View>
    </View>)
}