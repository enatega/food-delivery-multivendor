import React from 'react'
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useStyles } from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'

import DeliveryIcon from '../../assets/SVG/delivery-icon'
import PickupIcon from '../../assets/SVG/pickup-icon'
import { alignment } from '../../utils/alignment'

export const FulfillmentMode = ({ theme, isPickup, setIsPickup, t }) => {
    const styles = useStyles(theme)
    return <View style={styles.container}>
        <View style={styles.ovalContainer}>
            <OvalButton theme={theme} styles={styles.ovalButton} title={t('Delivery')} selected={!isPickup} icon={<DeliveryIcon />} onSelect={() => { setIsPickup(false) }} />
            <OvalButton theme={theme} styles={styles.ovalButton} title={t('Pickup')} selected={isPickup} icon={<PickupIcon />} onSelect={() => { setIsPickup(true) }} />
        </View>
    </View>
}

const OvalButton = ({
    theme,
    selected = false, title,
    icon,
    onSelect,
    styles }) => (<Pressable onPress={onSelect} style={[styles, {
        backgroundColor: selected ? theme.main : null,
    }]}>
        <View style={alignment.MxSmall}>
            {icon}
        </View>
        <TextDefault bold={!selected} textColor={theme.color4}>{title}</TextDefault>
    </Pressable>)