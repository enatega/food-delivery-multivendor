import React, { useContext, useState, useMemo } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import EmptyAccountSectionArea from '../../components/EmptyAccountSectionArea'
import NotificationItem from '../../components/Notifications/NotificationItem'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

import styles from './styles'

const Notifications = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Dummy data for notifications
  const [notifications] = useState([
    {
      id: '1',
      type: 'pickup',
      description: 'Your order from Grocimart is ready for pickup',
      timestamp: '5 min ago',
      section: 'today'
    },
    {
      id: '2',
      type: 'order',
      description: 'Order confirmed: Delivery to Al Thumama',
      timestamp: '3 hours ago',
      section: 'today'
    },
    {
      id: '3',
      type: 'payment',
      description: 'Payment successful: QR 65.00 for Order #3922',
      timestamp: '8:19 PM',
      section: 'today'
    },
    {
      id: '4',
      type: 'promo',
      description: 'Promo unlocked: Get 15% off your next 2 orders',
      timestamp: 'Sep 12, 8:19 PM',
      section: 'past'
    },
    {
      id: '5',
      type: 'rate',
      description: 'Reminder: Rate your recent order from Freshket',
      timestamp: 'Aug 24, 8:19 PM',
      section: 'past'
    },
    {
      id: '6',
      type: 'receipt',
      description: 'Receipt available for Order #2957',
      timestamp: 'Aug 04, 8:19 PM',
      section: 'past'
    }
  ])

  // Group notifications by section
  const sections = useMemo(() => {
    const todayNotifications = notifications.filter(n => n.section === 'today')
    const pastNotifications = notifications.filter(n => n.section === 'past')

    const sectionsArray = []

    if (todayNotifications.length > 0) {
      sectionsArray.push({
        id: 'today',
        title: t('Today') || 'Today',
        data: todayNotifications
      })
    }

    if (pastNotifications.length > 0) {
      sectionsArray.push({
        id: 'past',
        title: t('Past') || 'Past',
        data: pastNotifications
      })
    }

    return sectionsArray
  }, [notifications, t])

  // Flatten sections for FlashList
  const flatListData = useMemo(() => {
    const items = []
    sections.forEach(section => {
      items.push({ type: 'header', id: `header-${section.id}`, title: section.title })
      section.data.forEach(item => {
        items.push({ type: 'item', ...item })
      })
    })
    return items
  }, [sections])

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles(currentTheme).sectionHeader}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).sectionHeaderText}
            bolder
          >
            {item.title}
          </TextDefault>
        </View>
      )
    }

    return (
      <NotificationItem
        notification={item}
        currentTheme={currentTheme}
      />
    )
  }

  const keyExtractor = (item) => item.id

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('titleNotifications')}
      />

      {flatListData.length > 0 ? (
        <FlashList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={60}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(currentTheme).listContent}
        />
      ) : (
        <EmptyAccountSectionArea
          currentTheme={currentTheme}
          imageSource={require('../../assets/images/empty_notifications.png')}
          title={t('You are all up to date')}
          description={t('No new notifications - come back soon')}
        />
      )}
    </SafeAreaView>
  )
}

export default Notifications
