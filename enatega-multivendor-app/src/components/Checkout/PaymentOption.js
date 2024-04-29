import React from 'react'
import { Pressable, View } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { FontAwesome } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'

export const PaymentModeOption = ({ theme, icon, title, selected, onSelect }) => {
    return (<Pressable onPress={onSelect} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: scale(8) }}>
        <View style={{ flex: 1 }}>
            <FontAwesome
                name={icon}
                size={scale(16)}
                color={theme?.fontFourthColor} />
        </View>
        <View style={{ flex: 6 }}>
            <TextDefault
                textColor={theme?.fontFourthColor}
                style={alignment.MLsmall}
                bold>
                {title}
            </TextDefault>
        </View>
        <View style={{ flex: 1 }}>
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