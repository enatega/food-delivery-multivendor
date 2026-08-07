import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'

export const PaymentModeOption = ({ theme, icon, iconFamily, title, selected, onSelect }) => {
    const IconComponent =
        iconFamily === 'material-community' ? MaterialCommunityIcons : FontAwesome

    return (<Pressable onPress={onSelect} style={{ flexDirection: theme?.isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: scale(48), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors?.borderSubtle }}>
        <View style={{ width: scale(34), alignItems: 'center' }}>
            <IconComponent
                name={icon}
                size={scale(16)}
                color={theme?.colors?.icon || theme?.fontFourthColor} />
        </View>
        <View style={{ flex: 6 }}>
            <TextDefault
                textColor={theme?.colors?.textPrimary || theme?.fontFourthColor}
                style={{ marginHorizontal : scale(10) }}
                bold
            isRTL>
                {title}
            </TextDefault>
        </View>
        <View style={{ width: scale(34), alignItems: 'center' }}>
            <RadioButton
                size={scale(10)}
                outerColor={theme?.color12}
                innerColor={theme?.main}
                animation={'bounceIn'}
                isSelected={selected}
                onPress={onSelect}
            />
        </View>
    </Pressable>)
}
