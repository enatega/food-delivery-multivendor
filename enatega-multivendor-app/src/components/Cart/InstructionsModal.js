import React, { useState } from 'react'
import { View, Modal, Pressable, TouchableOpacity } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import { useStyles } from './styles'

export const InstructionsModal = ({ theme }) => {
    const [visible, setVisible] = useState(true)
    const styles = useStyles(theme)
    return (<Modal
        visible={visible}
        animationType="slide"
        transparent={true}>
        <Pressable style={styles.layout} onPress={() => { setVisible(false) }}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <TouchableOpacity
                        onPress={() => { setVisible(false) }}
                        style={styles.closeButton}>
                        <TextDefault bolder textColor={theme.newButtonText}>Done</TextDefault>
                    </TouchableOpacity>
                </View>
                <View>
                    <TextDefault H2 bolder textColor={theme.color4}>Add message</TextDefault>
                    <TextDefault H5 bold textColor={theme.fontThirdColor} style={styles.secondaryText}>Special requests, allergies, dietary restriction</TextDefault>
                    <TextDefault H5 bold smaller textColor={theme.secondaryText} style={styles.ternaryText}>Kindly be advised that your message could also be visible to the courier partner responsible for delivering your order to the venue.</TextDefault>
                </View>
            </View>
        </Pressable>
    </Modal>)
}