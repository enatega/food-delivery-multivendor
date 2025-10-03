import React from 'react'
import { View, Modal, Pressable, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import { useStyles } from './styles'
import { scale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'
import { alignment } from '../../utils/alignment'

export const InstructionsModal = ({ theme, isVisible, hideModal, onSubmit, value, setValue, t }) => {  
    
    const styles = useStyles(theme)
    return (<Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.layout}>
            <Pressable style={styles.backdrop} onPress={hideModal} />
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <TouchableOpacity
                        onPress={onSubmit}
                        style={styles.closeButton}>
                        <TextDefault bolder textColor={theme.newButtonText}>{t('Done')}</TextDefault>
                    </TouchableOpacity>
                </View>
                <View>
                    <TextDefault H2 bolder textColor={theme.fontThirdColor} isRTL>{t('addMessage')}</TextDefault>
                    <TextDefault H5 bold textColor={theme.fontThirdColor} isRTL style={styles.secondaryText}>{t('specialRequest')}</TextDefault>
                    <TextDefault numberOfLines={3} H5 smaller isRTL textColor={theme.secondaryText} style={styles.ternaryText}>{t('kindlyBeAdvisedText')}</TextDefault>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        value={value} 
                        onChangeText={setValue} 
                        autoFocus 
                        onSubmitEditing={onSubmit} 
                        placeholderTextColor={theme.name === 'Dark' ? '#CCCCCC' : '#666666'} 
                        placeholder={t('typeHere')} 
                        allowFontScaling 
                        style={styles.textInput}
                        maxLength={400} 
                    />
                    <TouchableOpacity style={styles.clearButton} onPress={() => setValue('')}>
                        <Ionicons name='close-circle-outline' size={scale(18)} color={theme.fontNewColor} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    </Modal >)
}