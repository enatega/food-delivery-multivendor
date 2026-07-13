import React, { useContext, useState, useRef } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import PaymentMethodBottomSheet from '../../components/PaymentMethod/PaymentMethodBottomSheet'
import { styles } from './styles'

const PaymentMethod = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Mock payment methods data
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      lastFourDigits: '9432',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      lastFourDigits: '4891',
      isDefault: false,
    },
    {
      id: 3,
      type: 'applepay',
      lastFourDigits: '0284',
      isDefault: false,
    }
  ])

  // Ref for bottom sheet
  const bottomSheetRef = useRef(null)

  // Handler to open bottom sheet
  const handleAddPaymentMethod = () => {
    bottomSheetRef.current?.open()
  }

  // Handler for setting default payment method
  const handleSetDefault = () => {
    console.log('Set as default clicked')
    // Add your logic here
  }

  // Handler for removing payment method
  const handleRemove = () => {
    console.log('Remove payment method clicked')
    // Add your logic here
  }


  const renderPaymentIcon = (type) => {
    switch (type) {
      case 'visa':
        return (
          <View style={styles(currentTheme).iconContainer}>
            <TextDefault bolder style={styles(currentTheme).visaText}>VISA</TextDefault>
          </View>
        )
      case 'mastercard':
        return (
          <View style={styles(currentTheme).mastercardContainer}>
            <View style={[styles(currentTheme).mastercardCircle, { backgroundColor: '#EB001B' }]} />
            <View bold style={[styles(currentTheme).mastercardCircle, styles(currentTheme).mastercardCircleRight, { backgroundColor: '#F79E1B' }]} />
          </View>
        )
      case 'applepay':
        return (
          <View style={styles(currentTheme).applePayContainer}>
            <Ionicons name="logo-apple" size={24} color="#000" />
            <TextDefault bold style={styles(currentTheme).applePayText}>Pay</TextDefault>
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles(currentTheme).scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(currentTheme).content}>
        <TextDefault bolder style={styles(currentTheme).title}>
          {t('Payment Methods') || 'Payment Methods'}
        </TextDefault>
          <TextDefault bold style={styles(currentTheme).subtitle}>
            {t('Add or Update your saved payment methods.') || 'Add or Update your saved payment methods.'}
          </TextDefault>

          <View style={styles(currentTheme).paymentMethodsList}>
            {paymentMethods.map((method, index) => (
              <View 
                key={method.id} 
                style={[
                  styles(currentTheme).paymentCard,
                  index === paymentMethods.length - 1 && styles(currentTheme).lastCard
                ]}
              >
                <TouchableOpacity style={styles(currentTheme).cardLeft} onPress={() => navigation.navigate('AddPaymentMethod')}>
                  {renderPaymentIcon(method.type)}
                  
                  <View style={styles(currentTheme).cardInfo}>
                    <View style={styles(currentTheme).cardNumberRow}>
                      <TextDefault bold style={styles(currentTheme).cardNumber}>
                        **** {method.lastFourDigits}
                      </TextDefault>
                      {method.isDefault && (
                        <View style={styles(currentTheme).defaultBadge}>
                          <TextDefault bold style={styles(currentTheme).defaultText}>
                            {t('Default') || 'Default'}
                          </TextDefault>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles(currentTheme).cardRight}>
                  
                    <TouchableOpacity style={styles(currentTheme).menuButton}>
                      <Ionicons 
                        name="ellipsis-vertical" 
                        size={20} 
                        color={currentTheme.black} 
                      />
                    </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles(currentTheme).footer}>
        <TouchableOpacity 
          style={styles(currentTheme).addButton}
          activeOpacity={0.7}
          onPress={handleAddPaymentMethod}
        >
          <Ionicons 
            name="add" 
            size={24} 
            color={currentTheme.headerMainFontColor}
          />
          <TextDefault bold style={styles(currentTheme).addButtonText}>
            {t('Add payment method') || 'Add payment method'}
          </TextDefault>
        </TouchableOpacity>
      </View>

      {/* Payment Method Bottom Sheet */}
      <PaymentMethodBottomSheet
        ref={bottomSheetRef}
        onSetDefault={handleSetDefault}
        onRemove={handleRemove}
      />
    </SafeAreaView>
  )
}

export default PaymentMethod
