import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import SectionHeader from './SectionHeader'
import MenuListItem from './MenuListItem'
import UserContext from '../../../context/User'

const AccountManagement = () => {
  const { t, i18n } = useTranslation()
  const { logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={t('Account Management')} />
      <View style={styles(currentTheme).menuContainer}>
        <MenuListItem
          icon="trash-outline"
          title={t('Delete my account')}
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity
        style={styles(currentTheme).logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <TextDefault
          bold
          textColor="#DC2626"
          style={styles(currentTheme).logoutText}
        >
          {t('Logout')}
        </TextDefault>
      </TouchableOpacity>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(16)
    },
    menuContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
      overflow: 'hidden'
    },
    logoutButton: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: verticalScale(16),
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#DC2626',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    logoutText: {
      fontSize: scale(15)
    }
  })

export default AccountManagement
