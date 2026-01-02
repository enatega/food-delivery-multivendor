import React, { useContext, useState } from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { AntDesign } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

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
      {/* Header */}
      <View style={styles(currentTheme).header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles(currentTheme).backButton}
          activeOpacity={0.7}
        >
          <View style={styles(currentTheme).backButtonCircle}>
            <AntDesign
              name="arrowleft"
              size={20}
              color={currentTheme.fontMainColor}
            />
          </View>
        </TouchableOpacity>
        <View style={styles(currentTheme).headerRight} />
      </View>

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title */}
        <View style={styles(currentTheme).logoContainer}>
          <Image
            source={require('../../assets/images/my-fast-logo.png')}
            style={styles(currentTheme).logo}
            resizeMode="contain"
          />
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={styles(currentTheme).subtitle}
            bold
          >
            {t('Unlimited €1 Deliveries')}
          </TextDefault>
        </View>

        {/* Membership Plans */}
        <View style={styles(currentTheme).plansContainer}>
          {membershipPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles(currentTheme).planCard,
                selectedPlan === plan.id && styles(currentTheme).planCardSelected
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              {plan.popular && (
                <View style={styles(currentTheme).popularBadge}>
                  <TextDefault
                    textColor={currentTheme.white}
                    style={styles(currentTheme).popularText}
                    bold
                  >
                    {t('Most popular')}
                  </TextDefault>
                </View>
              )}
              
              <View style={styles(currentTheme).planHeader}>
                <View style={styles(currentTheme).planTitleContainer}>
                  <TextDefault
                    textColor={
                      selectedPlan === plan.id
                        ? currentTheme.colorTextPrimary
                        : currentTheme.fontMainColor
                    }
                    style={styles(currentTheme).planTitle}
                    bolder
                  >
                    {plan.title}
                  </TextDefault>
                  <TextDefault
                    textColor={
                      selectedPlan === plan.id
                        ? currentTheme.colorTextPrimary
                        : currentTheme.colorTextMuted
                    }
                    style={styles(currentTheme).planBilling}
                    bold
                  >
                    {plan.totalPrice} {plan.billingPeriod}
                  </TextDefault>
                </View>
                
                <View style={styles(currentTheme).planPriceContainer}>
                  <TextDefault
                    textColor={
                      selectedPlan === plan.id
                        ? currentTheme.colorTextPrimary
                        : currentTheme.fontMainColor
                    }
                    style={styles(currentTheme).planPrice}
                    bold
                  >
                    {plan.price}
                  </TextDefault>
                  <TextDefault
                    textColor={
                      selectedPlan === plan.id
                        ? currentTheme.colorTextPrimary
                        : currentTheme.colorTextMuted
                    }
                    style={styles(currentTheme).planPeriod}
                    bold
                  >
                    {plan.displayPeriod}
                  </TextDefault>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Link */}
        <View style={styles(currentTheme).faqContainer}>
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={styles(currentTheme).faqText}
            bold
          >
            {t('More questions? See our')}{' '}
          </TextDefault>
          <TouchableOpacity onPress={handleFAQ} activeOpacity={0.7}>
            <TextDefault
              textColor={currentTheme.colorTextPrimary}
              style={styles(currentTheme).faqLink}
              bold
            >
              {t('FAQ')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Subscribe Button - Fixed at bottom */}
      <View style={styles(currentTheme).bottomSection}>
        <TouchableOpacity
          style={styles(currentTheme).subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={currentTheme.white}
            style={styles(currentTheme).subscribeButtonText}
            bold
          >
            {t('Subscribe')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Membership
