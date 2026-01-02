import React, { useContext, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import {
  MembershipHeader,
  MembershipLogo,
  PlansList,
  FAQLink,
  SubscribeButton
} from '../../components/Membership'

import styles from './styles'

const Membership = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [selectedPlan, setSelectedPlan] = useState('monthly')

  // TODO: Get from backend
  const membershipPlans = [
    {
      id: 'yearly',
      title: '1 Year',
      price: '€6,67',
      totalPrice: '€79,99',
      billingPeriod: 'billed for 1 year',
      displayPeriod: 'monthly',
      popular: false
    },
    {
      id: 'monthly',
      title: 'Monthly',
      price: '€7,99',
      totalPrice: '€7,99',
      billingPeriod: 'billed for 1 month',
      displayPeriod: 'monthly',
      popular: true
    }
  ]

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    console.log('Subscribe to:', selectedPlan)
  }

  const handleFAQ = () => {
    // TODO: Navigate to FAQ or open FAQ modal
    console.log('Open FAQ')
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <MembershipHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MembershipLogo currentTheme={currentTheme} />

        <PlansList
          plans={membershipPlans}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          currentTheme={currentTheme}
        />

        <FAQLink currentTheme={currentTheme} onPress={handleFAQ} />
      </ScrollView>

      <SubscribeButton currentTheme={currentTheme} onPress={handleSubscribe} />
    </SafeAreaView>
  )
}

export default Membership
