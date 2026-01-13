import React, { useContext, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { VoucherCard } from '../../components/Vouchers'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import EmptyAccountSectionArea from '../../components/EmptyAccountSectionArea'

import styles from './styles'

const Vouchers = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // TODO: Get from backend
  const [vouchers] = useState([
    {
      id: '1',
      title: 'Black Friday',
      description: 'Use during black Friday week',
      discountAmount: '€10',
      discountLabel: 'Off',
      badge: 'Limited time',
      badgeType: 'warning'
    },
     {
      id: '2',
      title: 'Special Discount',
      description: 'For new customers',
      discountAmount: '€20',
      discountLabel: 'Off',
      badge: '',
      badgeType: 'warning'
    }
  ])

  const handleUseVoucher = (voucherId) => {
    // TODO: Implement voucher usage logic
    console.log('Use voucher:', voucherId)
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('Vouchers')}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              currentTheme={currentTheme}
              onUse={() => handleUseVoucher(voucher.id)}
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
    </SafeAreaView>
  )
}

export default Vouchers
