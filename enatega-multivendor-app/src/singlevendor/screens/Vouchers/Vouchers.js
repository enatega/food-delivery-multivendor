
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Alert, RefreshControl, Platform, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import VoucherSkeleton from '../../components/Vouchers/VoucherSkeleton'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { VoucherCard, EmptyVouchers } from '../../components/Vouchers'
import { COUPONS_BY_RESTAURANT } from '../../../apollo/queries'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import EmptyAccountSectionArea from '../../components/EmptyAccountSectionArea'
import AsyncStorage from '@react-native-async-storage/async-storage'

import styles from './styles'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Vouchers = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const shouldReturnToCheckout = route?.params?.returnTo === 'Checkout'
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Fetch coupons from backend
  const { data, loading, error, refetch } = useQuery(COUPONS_BY_RESTAURANT, {
    fetchPolicy: 'network-only'
  })
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetch])

  const [voucherInUse, setVoucherInUse] = useState(null)

  const vouchers = data?.couponsbyRestaurant?.filter((coupon) => coupon.enabled) || []

  const insets = useSafeAreaInsets()

  const getSelectedVoucher = useCallback(async () => {
    try {
      const voucher = await AsyncStorage.getItem('selectedVoucher')
      const parsedVoucher = JSON.parse(voucher)
      setVoucherInUse(() => parsedVoucher)
    } catch (error) {
      console.log('🚀 ~ getSelectedVoucher ~ error:', error)
    }
  }, [setVoucherInUse])

  useEffect(() => {
    getSelectedVoucher()
  }, [getSelectedVoucher])

  const handleUseVoucher = async (voucher) => {
    try {
      const stringifiedVoucher = JSON.stringify(voucher)
      await AsyncStorage.setItem('selectedVoucher', stringifiedVoucher)
      setVoucherInUse(voucher)
      if (shouldReturnToCheckout) {
        navigation.goBack()
      }
    } catch (error) {
      console.log('🚀 ~ handleUseVoucher ~ error:', error)
    }
  }

  const handleRemoveVoucher = async () => {
    try {
      await AsyncStorage.removeItem('selectedVoucher')
      setVoucherInUse(null)
      if (shouldReturnToCheckout) {
        navigation.goBack()
      }
    } catch (error) {
      console.log('🚀 ~ handleRemoveVoucher ~ error:', error)
    }
  }

  const handleUpdateVoucher = (voucher) => {
    Alert.alert(
      `${voucherInUse?.title} is already in use.`,
      `Are you want to use ${voucher?.title}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed')
        },
        {
          text: 'OK',
          onPress: () => handleUseVoucher(voucher)
        }
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={[styles(currentTheme).container, Platform.OS === 'android' ? { paddingTop: insets.top } : {}]}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('Vouchers')}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}
      >
        {loading ? (
          <>
            <VoucherSkeleton currentTheme={currentTheme} />
            <VoucherSkeleton currentTheme={currentTheme} />
          </>
        ) : error ? (
          <EmptyVouchers currentTheme={currentTheme} />
        ) : vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <VoucherCard
              voucherInUse={voucherInUse?._id}
              key={voucher._id}
              voucher={{
                id: voucher._id,
                title: voucher.title,
                description: t('Save on your order'),
                discountAmount: `${voucher.discount}`,
                discountLabel: t('Off'),
                badge: 'Limited time',
                badgeType: 'warning'
              }}
              currentTheme={currentTheme}
              onUse={() => (voucherInUse ? handleUpdateVoucher(voucher) : handleUseVoucher(voucher))}
              onRemove={handleRemoveVoucher}
            />
          ))
        ) : (
          <EmptyAccountSectionArea
            currentTheme={currentTheme}
            imageSource={require('../../assets/images/empty-vouchers.png')}
            title={t('No vouchers available')}
            description={t('Check back soon — exciting offers might appear here!')}
          />
        )}
      </ScrollView>
    </View>
  )
}

export default Vouchers
