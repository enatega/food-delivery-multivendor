import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'

const ProductImageOverlay = ({ hasDeal, onAddToCart, product, dealText = 'Deal' }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <>
      {hasDeal && (
        <View style={styles(currentTheme).dealTag}>
          <AntDesign name="tag" size={12} color={currentTheme.white} />
          <Text style={styles(currentTheme).dealText}>{dealText}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles(currentTheme).addButton}
        onPress={() => onAddToCart(product)}
      >
        <AntDesign name="plus" size={16}  />
      </TouchableOpacity>
    </>
  )
}

const styles = (currentTheme) => StyleSheet.create({
  dealTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: currentTheme.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1
  },
  dealText: {
    color: currentTheme.white,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: currentTheme.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: currentTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  }
})

export default ProductImageOverlay

