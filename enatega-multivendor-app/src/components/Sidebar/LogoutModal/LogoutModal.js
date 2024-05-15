import React, { useContext } from 'react'
import { View, TouchableOpacity, Modal, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { Feather } from '@expo/vector-icons'

const LogoutModal = ({ visible, onCancel, onLogout, showCrossButton }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles().layout}>
        <Pressable style={styles().backdrop} onPress={onCancel} />
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H3
              style={styles().modalHeader}
            >
              {t('LoggingOut')}
            </TextDefault>
            {showCrossButton && (
              <Feather
                name='x-circle'
                size={24}
                color={currentTheme.newFontcolor}
                onPress={onCancel}
              />
            )}
          </View>

          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles().modalText}
          >
            {t('SeeYouAgainSoon')}
          </TextDefault>

          {/* <View style={styles(currentTheme).modalButtonsContainer}>
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
          </View> */}

          <TouchableOpacity
            style={[
              styles(currentTheme).btn,
              styles(currentTheme).btnLogout,
            ]}
            onPress={onLogout}
          >
            <TextDefault bolder H4 textColor={currentTheme.red600}>
              {t('Logout')}
            </TextDefault>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles(currentTheme).btn,
              styles(currentTheme).btnCancel,
            ]}
            onPress={onCancel}
          >
            <TextDefault bolder H4 textColor={currentTheme.linkColor}>
              {t('Cancel')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default LogoutModal
