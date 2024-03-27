import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'

const LogoutModal = ({ visible, onCancel, onLogout }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles(currentTheme).modalContainer}>
        <View style={styles(currentTheme).modalContent}>
          <Text style={styles(currentTheme).modalHeader}>
            {t('LoggingOut')}
          </Text>
          <Text style={styles(currentTheme).modalText}>
            {t('SeeYouAgainSoon')}
          </Text>
          <View style={styles(currentTheme).modalButtonsContainer}>
            <TouchableOpacity onPress={onCancel}>
              <TextDefault textColor={currentTheme.tagColor} bolder>
                {t('Cancel')}
              </TextDefault>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout}>
              <TextDefault textColor={currentTheme.tagColor} bolder>
                {t('Logout')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default LogoutModal
