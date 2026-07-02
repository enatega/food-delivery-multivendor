import React, { useContext } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'

const SessionExpiredModal = ({ visible, onLogin }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} />
        <View
          style={[
            styles.container,
            {
              backgroundColor: currentTheme.cardBackground
            }
          ]}
        >
          <TextDefault H3 bolder textColor={currentTheme.fontMainColor} center>
            Session Expired
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontSecondColor || currentTheme.fontMainColor}
            center
            style={styles.message}
          >
            Your session has expired. Please login again.
          </TextDefault>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogin}
            style={[
              styles.button,
              {
                backgroundColor: currentTheme.primary
              }
            ]}
          >
            <TextDefault H4 bolder textColor={currentTheme.white} center>
              Login
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  container: {
    width: '86%',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28
  },
  message: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 22
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  }
})

export default SessionExpiredModal
