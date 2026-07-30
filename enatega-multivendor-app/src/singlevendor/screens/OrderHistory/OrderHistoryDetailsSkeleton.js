import React from 'react'
import { View, SafeAreaView, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './OrderHistoryDetailStyle'

const OrderHistoryDetailsSkeleton = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = React.useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const themedStyles = styles(currentTheme)

  const orderItemCount = 3

  return (
    <SafeAreaView style={themedStyles.container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('Order details') || 'Order details'}
      />

      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status Section Skeleton */}
        <View style={themedStyles.section}>
          <LoadingSkeleton
            width={scale(120)}
            height={verticalScale(16)}
            borderRadius={scale(4)}
            style={{ marginBottom: verticalScale(12) }}
          />
          <LoadingSkeleton
            width={scale(80)}
            height={verticalScale(24)}
            borderRadius={scale(16)}
          />
        </View>

        {/* Scheduled For Section Skeleton */}
        <View style={themedStyles.section}>
          <LoadingSkeleton
            width={scale(140)}
            height={verticalScale(16)}
            borderRadius={scale(4)}
            style={{ marginBottom: verticalScale(12) }}
          />
          <View style={themedStyles.scheduledRow}>
            <LoadingSkeleton
              width={scale(18)}
              height={scale(18)}
              borderRadius={scale(4)}
              style={themedStyles.calendarIcon}
            />
            <LoadingSkeleton
              width={scale(180)}
              height={verticalScale(14)}
              borderRadius={scale(4)}
            />
          </View>
        </View>

        {/* Order Items Section Skeleton */}
        <View style={themedStyles.section}>
          <LoadingSkeleton
            width={scale(110)}
            height={verticalScale(16)}
            borderRadius={scale(4)}
            style={{ marginBottom: verticalScale(12) }}
          />
          {Array.from({ length: orderItemCount }).map((_, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: index < orderItemCount - 1 ? verticalScale(16) : 0
              }}
            >
              <LoadingSkeleton
                width={scale(60)}
                height={scale(60)}
                borderRadius={scale(8)}
                style={{ marginRight: scale(12) }}
              />
              <View style={{ flex: 1 }}>
                <LoadingSkeleton
                  width="75%"
                  height={verticalScale(14)}
                  borderRadius={scale(4)}
                  style={{ marginBottom: verticalScale(8) }}
                />
                <LoadingSkeleton
                  width="50%"
                  height={verticalScale(12)}
                  borderRadius={scale(4)}
                  style={{ marginBottom: verticalScale(6) }}
                />
                <LoadingSkeleton
                  width={scale(70)}
                  height={verticalScale(18)}
                  borderRadius={scale(4)}
                />
              </View>
              <LoadingSkeleton
                width={scale(50)}
                height={verticalScale(16)}
                borderRadius={scale(4)}
              />
            </View>
          ))}
        </View>

        {/* Payment Details Section Skeleton */}
        <View style={themedStyles.section}>
          <LoadingSkeleton
            width={scale(130)}
            height={verticalScale(16)}
            borderRadius={scale(4)}
            style={{ marginBottom: verticalScale(12) }}
          />
          <View style={themedStyles.paymentRow}>
            <LoadingSkeleton
              width={scale(100)}
              height={verticalScale(14)}
              borderRadius={scale(4)}
            />
            <LoadingSkeleton
              width={scale(70)}
              height={verticalScale(14)}
              borderRadius={scale(4)}
            />
          </View>
        </View>

        <View style={themedStyles.buttonSpacer} />
      </ScrollView>

      {/* Order Summary Skeleton (sticky bottom) */}
      <View style={themedStyles.stickyBottomContainer}>
        <LoadingSkeleton
          width="100%"
          height={verticalScale(40)}
          borderRadius={scale(8)}
          style={{ marginBottom: verticalScale(8) }}
        />
        <LoadingSkeleton
          width="100%"
          height={verticalScale(24)}
          borderRadius={scale(4)}
        />
      </View>

      {/* Action Button Skeleton */}
      <View style={themedStyles.buttonContainer}>
        <LoadingSkeleton
          width="100%"
          height={verticalScale(48)}
          borderRadius={scale(12)}
        />
      </View>
    </SafeAreaView>
  )
}

export default OrderHistoryDetailsSkeleton
