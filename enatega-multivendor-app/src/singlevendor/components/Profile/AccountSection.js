import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { verticalScale } from '../../../utils/scaling'
import SectionHeader from './SectionHeader'
import MenuListItem from './MenuListItem'

const AccountSection = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const accountItems = [
    {
      id: 1,
      icon: 'person-outline',
      title: t('Account details'),
      onPress: () => navigation.navigate('AccountDetails')
    },
    {
      id: 2,
      icon: 'card-outline',
      title: t('Payment methods'),
      onPress: () => navigation.navigate('PaymentMethod')
    },
    {
      id: 3,
      icon: 'ticket-outline',
      title: t('Vouchers'),
      onPress: () => navigation.navigate('Vouchers')
    },
    {
      id: 4,
      icon: 'notifications-outline',
      title: t('Notifications'),
      onPress: () => navigation.navigate('NotificationScreen')
    },
    {
      id: 5,
      icon: 'wallet-outline',
      title: t('Wallet'),
      onPress: () => {}
    },
    {
      id: 6,
      icon: 'settings-outline',
      title: t('Security and settings'),
      onPress: () => navigation.navigate('SecuritySettings')
    }
  ]

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={t('Account')} />
      <View style={styles(currentTheme).menuContainer}>
        {accountItems.map((item, index) => (
          <View key={item.id}>
            <MenuListItem
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
            {index < accountItems.length - 1 && (
              <View style={styles(currentTheme).separator} />
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(16),

    },
    menuContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
      overflow: 'hidden',
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.05,
      // shadowRadius: 4,
      // elevation: 2
    },
    separator: {
      height: 1,
      backgroundColor: currentTheme?.horizontalLine || '#E5E5E5',
      opacity: 0.5
    }
  })

export default AccountSection
