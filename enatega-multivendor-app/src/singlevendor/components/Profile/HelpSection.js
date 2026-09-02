import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale, verticalScale } from '../../../utils/scaling'
import SectionHeader from './SectionHeader'
import MenuListItem from './MenuListItem'

const HelpSection = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const helpItems = [
    {
      id: 1,
      icon: 'help-circle-outline',
      title: t('CustomerSupport'),
      onPress: () => navigation.navigate('CustomerSupport')
    },
    {
      id: 2,
      icon: 'chatbubble-outline',
      title: t('titleFAQ'),
      onPress: () => navigation.navigate('Help')
    },
    {
      id: 3,
      icon: 'star-outline',
      title: t('Give feedback'),
      onPress: () => navigation.navigate('FeedBack', { fromProfileHelpFeedback: true })
    }
  ]

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={t('Help & Support')} />
      <View style={styles(currentTheme).menuContainer}>
        {helpItems.map((item, index) => (
          <View key={item.id}>
            <MenuListItem
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
            {index < helpItems.length - 1 && (
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
      marginBottom: verticalScale(16)
    },
    menuContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderColor: currentTheme?.colorBorder || '#E5E7EB',
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      marginHorizontal: scale(16),
      overflow: 'hidden'
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.05,
      // shadowRadius: 4,
      // elevation: 2
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: currentTheme?.colorBorder || '#E5E7EB',
      marginLeft: scale(54),
      marginRight: scale(14),
      opacity: 0.72
    }
  })

export default HelpSection
