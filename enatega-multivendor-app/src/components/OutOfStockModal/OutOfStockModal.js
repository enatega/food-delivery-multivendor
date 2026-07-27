import React, { useContext } from 'react'
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'

const OutOfStockModal = ({ visible, onClose }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.dialog,
            { backgroundColor: currentTheme.cardBackground }
          ]}
        >
          <TextDefault H4 bolder center textColor={currentTheme.fontMainColor}>
            Currently Unavailable
          </TextDefault>
          <TextDefault
            center
            textColor={currentTheme.fontSecondColor}
            style={styles.message}
          >
            Item Out of Stock
          </TextDefault>
          <TouchableOpacity
            accessibilityRole='button'
            activeOpacity={0.8}
            onPress={onClose}
            style={[
              styles.button,
              { backgroundColor: currentTheme.primary }
            ]}
          >
            <TextDefault bolder center textColor={currentTheme.buttonText}>
              OK
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  dialog: {
    width: '82%',
    borderRadius: 16,
    padding: 24
  },
  message: {
    marginTop: 8,
    marginBottom: 24
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12
  }
})

export default OutOfStockModal
