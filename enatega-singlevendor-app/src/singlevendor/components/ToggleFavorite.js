import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import useFavorite from '../screens/Favorite/useFavorite'
import Spinner from '../../components/Spinner/Spinner'
import UserContext from '../../context/User'
import { useNavigation } from '@react-navigation/native'

const ToggleFavorite = ({ id }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const navigation = useNavigation()
  const { profile } = useContext(UserContext)
  const { loading, handleMutate, isFavorite } = useFavorite({id})

  const toggleFavorite = () => {
    if (!profile) return navigation?.navigate('CreateAccount')
    handleMutate(id)
  }

  return (
    <Pressable onPress={() => toggleFavorite()} disabled={loading} style={styles(currentTheme).pressableContainer}>
      {loading ? <Spinner size='small' backColor='transparent' spinnerColor={currentTheme?.newIconColor} /> : isFavorite ? <FontAwesome name='heart' size={20} color={currentTheme?.newIconColor} /> : <FontAwesome name='heart-o' size={20} color={currentTheme?.newIconColor} />}
    </Pressable>
  )
}

export default ToggleFavorite

const styles = (props = null) =>
  StyleSheet.create({
    pressableContainer: {
      backgroundColor: props !== null ? props?.colorBgTertiary : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      height: 32,
      width: 32
    }
  })
