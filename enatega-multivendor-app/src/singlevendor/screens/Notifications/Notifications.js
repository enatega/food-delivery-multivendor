import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity } from 'react-native'
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
import useTodayNotifications from './useTodayNotifications'
import usePastNotifications from './usePastNotifications'
import { calculateDaysAgo } from '../../../utils/customFunctions'
import { formatNotificationDate } from '../../utils/dateHelpers'

import styles from './styles'

const PAGE_LIMIT = 10

const Notifications = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // State for notifications and pagination
  const [todaySkip, setTodaySkip] = useState(0)
  const [pastSkip, setPastSkip] = useState(0)
  const [todayNotifications, setTodayNotifications] = useState([])
  const [pastNotifications, setPastNotifications] = useState([])
  const [isLoadingMoreToday, setIsLoadingMoreToday] = useState(false)
  const [isLoadingMorePast, setIsLoadingMorePast] = useState(false)


  
  // Fetch today's notifications
  const { 
    data: todayData, 
    loading: todayLoading, 
    error: todayError, 
    refetch: refetchToday,
    pageInfo: todayPageInfo
  } = useTodayNotifications({
    skip: todaySkip,
    limit: PAGE_LIMIT,
    skipQuery: false
  })

  // Fetch past notifications
  const { 
    data: pastData, 
    loading: pastLoading, 
    error: pastError, 
    refetch: refetchPast,
    pageInfo: pastPageInfo
  } = usePastNotifications({
    skip: pastSkip,
    limit: PAGE_LIMIT,
    skipQuery: false
  })

  // Transform and update today's notifications
  useEffect(() => {
    if (todayData?.todayNotificationsByToken?.notifications) {
      const transformedItems = todayData.todayNotificationsByToken.notifications.map((notification) => {
        // Determine notification type based on title/body content
        let type = 'order' // default
        const titleLower = (notification.title || '').toLowerCase()
        const bodyLower = (notification.body || '').toLowerCase()
        
        if (titleLower.includes('pickup') || bodyLower.includes('pickup')) {
          type = 'pickup'
        } else if (titleLower.includes('payment') || bodyLower.includes('payment')) {
          type = 'payment'
        } else if (titleLower.includes('promo') || bodyLower.includes('promo') || bodyLower.includes('discount')) {
          type = 'promo'
        } else if (titleLower.includes('rate') || bodyLower.includes('rate') || bodyLower.includes('review')) {
          type = 'rate'
        } else if (titleLower.includes('receipt') || bodyLower.includes('receipt')) {
          type = 'receipt'
        }

        return {
          id: notification._id,
          type: type,
          description: notification.body || notification.title || '',
          timestamp: calculateDaysAgo(notification.createdAt),
          section: 'today'
        }
      })

      if (todaySkip === 0) {
        setTodayNotifications(transformedItems)
      } else {
        setTodayNotifications(prev => [...prev, ...transformedItems])
      }
      setIsLoadingMoreToday(false)
    }
  }, [todayData, todaySkip])

  // Transform and update past notifications
  useEffect(() => {
    if (pastData?.pastNotificationsByToken?.notifications) {
      const transformedItems = pastData.pastNotificationsByToken.notifications.map((notification) => {
        // Determine notification type based on title/body content
        let type = 'order' // default
        const titleLower = (notification.title || '').toLowerCase()
        const bodyLower = (notification.body || '').toLowerCase()
        
        if (titleLower.includes('pickup') || bodyLower.includes('pickup')) {
          type = 'pickup'
        } else if (titleLower.includes('payment') || bodyLower.includes('payment')) {
          type = 'payment'
        } else if (titleLower.includes('promo') || bodyLower.includes('promo') || bodyLower.includes('discount')) {
          type = 'promo'
        } else if (titleLower.includes('rate') || bodyLower.includes('rate') || bodyLower.includes('review')) {
          type = 'rate'
        } else if (titleLower.includes('receipt') || bodyLower.includes('receipt')) {
          type = 'receipt'
        }

        return {
          id: notification._id,
          type: type,
          description: notification.body || notification.title || '',
          timestamp: formatNotificationDate(notification.createdAt),
          section: 'past'
        }
      })

      if (pastSkip === 0) {
        setPastNotifications(transformedItems)
      } else {
        setPastNotifications(prev => [...prev, ...transformedItems])
      }
      setIsLoadingMorePast(false)
    }
  }, [pastData, pastSkip])

  useEffect(() => {
    if (todayError) {
      setIsLoadingMoreToday(false)
    }
  }, [todayError])

  useEffect(() => {
    if (pastError) {
      setIsLoadingMorePast(false)
    }
  }, [pastError])

  // Handle load more for today's notifications
  const handleLoadMoreToday = useCallback(async () => {
    if (isLoadingMoreToday || todayLoading) return
    if (!todayPageInfo?.canShowMore) return

    setIsLoadingMoreToday(true)
    const nextSkip = todayPageInfo?.nextSkip ?? todaySkip + PAGE_LIMIT
    const previousSkip = todaySkip
    setTodaySkip(nextSkip)

    try {
      await refetchToday({
        skip: nextSkip,
        limit: PAGE_LIMIT
      })
    } catch (error) {
      console.error('Error loading more today notifications:', error)
      setIsLoadingMoreToday(false)
      setTodaySkip(previousSkip)
    }
  }, [isLoadingMoreToday, todayLoading, todayPageInfo, todaySkip, refetchToday])

  // Handle load more for past notifications
  const handleLoadMorePast = useCallback(async () => {
    if (isLoadingMorePast || pastLoading) return
    if (!pastPageInfo?.canShowMore) return

    setIsLoadingMorePast(true)
    const nextSkip = pastPageInfo?.nextSkip ?? pastSkip + PAGE_LIMIT
    const previousSkip = pastSkip
    setPastSkip(nextSkip)

    try {
      await refetchPast({
        skip: nextSkip,
        limit: PAGE_LIMIT
      })
    } catch (error) {
      console.error('Error loading more past notifications:', error)
      setIsLoadingMorePast(false)
      setPastSkip(previousSkip)
    }
  }, [isLoadingMorePast, pastLoading, pastPageInfo, pastSkip, refetchPast])

  // Group notifications by section
  const sections = useMemo(() => {
    const sectionsArray = []

    if (todayNotifications.length > 0) {
      sectionsArray.push({
        id: 'today',
        title: t('Today') || 'Today',
        data: todayNotifications,
        hasMore: todayPageInfo?.hasMore || false,
        canShowMore: todayPageInfo?.canShowMore || false,
        isEndReached: todayPageInfo?.isEndReached || false,
        isLoadingMore: isLoadingMoreToday,
        onLoadMore: handleLoadMoreToday
      })
    }

    if (pastNotifications.length > 0) {
      sectionsArray.push({
        id: 'past',
        title: t('Past') || 'Past',
        data: pastNotifications,
        hasMore: pastPageInfo?.hasMore || false,
        canShowMore: pastPageInfo?.canShowMore || false,
        isEndReached: pastPageInfo?.isEndReached || false,
        isLoadingMore: isLoadingMorePast,
        onLoadMore: handleLoadMorePast
      })
    }

    return sectionsArray
  }, [todayNotifications, pastNotifications, todayPageInfo, pastPageInfo, isLoadingMoreToday, isLoadingMorePast, t])

  // Flatten sections for FlashList
  const flatListData = useMemo(() => {
    const items = []
    sections.forEach((section, sectionIndex) => {
      items.push({ type: 'header', id: `header-${section.id}`, title: section.title })
      section.data.forEach(item => {
        items.push({ type: 'item', ...item })
      })
      // Add loading indicator at the end of each section if loading more
      if (section.isLoadingMore) {
        items.push({ 
          type: 'loader', 
          id: `loader-${section.id}`,
          sectionId: section.id 
        })
      } else if (section.canShowMore) {
        items.push({
          type: 'showMore',
          id: `showMore-${section.id}`,
          sectionId: section.id,
          onPress: section.onLoadMore
        })
      } else if (section.isEndReached) {
        items.push({
          type: 'endMessage',
          id: `endMessage-${section.id}`,
          sectionId: section.id
        })
      }
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

    if (item.type === 'loader') {
      return (
        <View style={{ paddingVertical: scale(20), alignItems: 'center' }}>
          <ActivityIndicator size="small" color={currentTheme?.main} />
        </View>
      )
    }

    if (item.type === 'showMore') {
      return (
        <View style={styles(currentTheme).paginationRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={item.onPress}
            style={styles(currentTheme).showMoreButton}
          >
            <TextDefault
              textColor={currentTheme?.fontWhite}
              style={styles(currentTheme).showMoreText}
            >
              {t('Show More') || 'Show More'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )
    }

    if (item.type === 'endMessage') {
      return (
        <View style={styles(currentTheme).paginationRow}>
          <TextDefault
            textColor={currentTheme?.fontMainColor}
            style={styles(currentTheme).endMessageText}
          >
            {t("There's no more notifications") || "There's no more notifications"}
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

  const keyExtractor = useCallback((item, index) => {
    // Ensure stable keys for all item types
    if (item.type === 'header' && item.id) {
      return item.id
    }
    if (item.type === 'loader' && item.id) {
      return item.id
    }
    if (item.type === 'showMore' && item.id) {
      return item.id
    }
    if (item.type === 'endMessage' && item.id) {
      return item.id
    }
    if (item.type === 'item' && item.id) {
      return item.id
    }
    // Fallback to index-based key only if id is not available
    return `${item.type}-${index}`
  }, [])

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('titleNotifications')}
      />

      {(todayLoading && todaySkip === 0) || (pastLoading && pastSkip === 0) ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={currentTheme?.main} />
        </View>
      ) : flatListData.length > 0 ? (
        <FlashList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={60}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles(currentTheme).listContent}
          removeClippedSubviews
          getItemType={(item) => item.type}
          extraData={flatListData.length}
          
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
