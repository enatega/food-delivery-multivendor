import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'
import Spinner from '../Spinner/Spinner'
import { useFavorite } from './useFavorite'

const FavoriteButton = ({ restaurantId, iconSize }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { isFavorite, loading, toggleFavorite } = useFavorite(restaurantId)

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={loading}
      onPress={toggleFavorite}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      pointerEvents={loading ? 'none' : 'auto'}
      style={{
        minWidth: scale(44),
        minHeight: scale(44),
        paddingHorizontal: scale(8),
        paddingVertical: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 9999,
        position: 'relative'
      }}
    >
      {loading ? <Spinner size={'small'} backColor={'transparent'} spinnerColor={currentTheme.iconColorDark} /> : <AntDesign name={isFavorite ? 'heart' : 'hearto'} size={iconSize} color={currentTheme.newIconColor} />}
    </TouchableOpacity>
  )
}

export default FavoriteButton
