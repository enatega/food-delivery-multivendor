import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'

const QuickActionsGrid = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const quickActions = [
    {
      id: 1,
      icon: 'heart-outline',
      label: t('My Favorites'),
      // onPress: () => navigation.navigate('Favourite')
      onPress: () => navigation.navigate('MyFavorites')
    },
    {
      id: 2,
      icon: 'time-outline',
      label: t('Order History'),
      onPress: () => navigation.navigate('OrderHistory')
    },
    {
      id: 3,
      icon: 'gift-outline',
      label: t('Refer a friend'),
      onPress: () => navigation.navigate('ReferAFriend')
    }
  ]

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).background}>
      </View>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles(currentTheme).actionCard}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={action.icon}
            size={scale(28)}
            color={action.id === 3 ? currentTheme.singlevendorcolor : currentTheme.iconColor}
          />
          <TextDefault
            textColor={action.id === 3 ? currentTheme.singlevendorcolor : currentTheme.fontMainColor}
            style={styles(currentTheme).actionLabel}
            numberOfLines={2}
            center
            bold
          >
            {action.label}
          </TextDefault>
        </TouchableOpacity>
      ))}
      
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: scale(12),
      marginBottom: verticalScale(20),
      position: 'relative'
      
    },
    background: {
      position: 'absolute',
      height: 80,
      width: '200%',
      backgroundColor: '#CCE9F5',
      top: 0,
      left: -scale(16),
      right: -scale(16)
    },
    actionCard: {
      flex: 1,
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: scale(12),
      paddingVertical: verticalScale(20),
      paddingHorizontal: scale(8),
      marginHorizontal: scale(4),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    actionLabel: {
      marginTop: verticalScale(8),
      fontSize: scale(12),
      textAlign: 'center',
    }
  })

export default QuickActionsGrid
