import React, { useContext } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import {
  VouchersHeader,
  VoucherCard,
  EmptyVouchers,
  VoucherSkeleton
} from '../../components/Vouchers'
import { COUPONS_BY_RESTAURANT } from '../../../apollo/queries'

import styles from './styles'

const Vouchers = () => {
  const navigation = useNavigation()
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Fetch coupons from backend
  const { data, loading, error } = useQuery(COUPONS_BY_RESTAURANT, {
    fetchPolicy: 'network-only'
  })

  const vouchers = data?.couponsbyRestaurant?.filter(coupon => coupon.enabled) || []

  const handleUseVoucher = (voucherId) => {
    // TODO: Implement voucher usage logic
    console.log('Use voucher:', voucherId)
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <VouchersHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
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
              key={voucher._id}
              voucher={{
                id: voucher._id,
                title: voucher.title,
                description: t('Save on your order'),
                discountAmount: `${voucher.discount}%`,
                discountLabel: t('Off'),
                badge: 'Limited time',
                badgeType: 'warning'
              }}
              currentTheme={currentTheme}
              onUse={() => handleUseVoucher(voucher._id)}
            />
          ))
        ) : (
          <EmptyVouchers currentTheme={currentTheme} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Vouchers
