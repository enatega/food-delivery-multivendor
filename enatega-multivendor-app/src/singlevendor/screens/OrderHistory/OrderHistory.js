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

const OrderHistory = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Dummy data for orders - set to empty array to show empty state, or populate to show orders
  const [orders] = useState([
    {
      id: '1',
      name: 'Veggie Spring Rolls',
      date: 'Sep 16, 4:12 PM',
      status: 'Ongoing',
      price: '€ 15.00',
      image: require('../../assets/images/sliderImg1.png'),
      section: 'ongoing'
    },
    {
      id: '2',
      name: 'Apple Juice',
      date: 'Sep 1, 1:42 AM',
      status: 'Order Delivered',
      price: '€ 65.00',
      image: require('../../assets/images/sliderImg1.png'),
      section: 'past'
    },
    {
      id: '3',
      name: 'Veggie Spring Rolls',
      date: 'Aug 24, 8:19 PM',
      status: 'Order Cancelled',
      price: '€ 55.00',
      image: require('../../assets/images/sliderImg1.png'),
      section: 'past'
    },
    {
      id: '4',
      name: 'Apple Juice',
      date: 'Aug 13, 2:02 PM',
      status: 'Order Delivered',
      price: '€ 60.00',
      image: require('../../assets/images/sliderImg1.png'),
      section: 'past'
    }
  ])

  // Group orders by section
  const sections = useMemo(() => {
    const ongoingOrders = orders.filter(o => o.section === 'ongoing')
    const pastOrders = orders.filter(o => o.section === 'past')

    const sectionsArray = []

    if (ongoingOrders.length > 0) {
      sectionsArray.push({
        id: 'ongoing',
        title: t('Ongoing order') || 'Ongoing order',
        data: ongoingOrders
      })
    }

    if (pastOrders.length > 0) {
      sectionsArray.push({
        id: 'past',
        title: t('Past Orders') || 'Past Orders',
        data: pastOrders
      })
    }

    return sectionsArray
  }, [orders, t])

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
        itemType="order"
      />
    )
  }

  const keyExtractor = (item) => item.id

  const handleStartShopping = () => {
    // Navigate to main/home screen
    navigation.navigate('Main')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('My Orders') || 'My Orders'}
      />

      {flatListData.length > 0 ? (
        <FlashList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(currentTheme).listContent}
        />
      ) : (
        <View style={styles(currentTheme).emptyContainer}>
          <EmptyAccountSectionArea
            currentTheme={currentTheme}
            imageSource={require('../../assets/images/empty_OrderHistory.png')}
            title={t('No orders yet') || 'No orders yet'}
            description={t('You haven\'t made any order. It will show here when you made one.') || 'You haven\'t made any order. It will show here when you made one.'}
            buttonTitle={t('Start shopping') || 'Start shopping'}
            onButtonPress={handleStartShopping}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default OrderHistory
