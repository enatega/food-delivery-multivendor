import React, { useContext, useState } from 'react'
import { SafeAreaView, View, ScrollView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons, Feather } from '@expo/vector-icons'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import Button from '../../../components/Button/Button'
import { styles } from './AddPaymentMethod.styles'

const AddPaymentMethod = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

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
          <TextDefault h1 bolder style={styles(currentTheme).title}>
            {t('Add payment methods') || 'Add payment methods'}
          </TextDefault>
          <TextDefault bold style={styles(currentTheme).subtitle}>
            {t('Add a credit or debit card to quickly complete purchases.') || 'Add a credit or debit card to quickly complete purchases.'}
          </TextDefault>

          <TextDefault bold style={styles(currentTheme).label}>
            {t('Card number') || 'Card number'}
          </TextDefault>
          <View style={styles(currentTheme).inputContainer}>
            <TextInput
              style={styles(currentTheme).input}
              placeholder={t('Card number') || "Card number"}
              placeholderTextColor="#9CA3AF"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
            />
            <Feather name="lock" size={20} color="#6B7280" />
          </View>

          <TextDefault bold style={styles(currentTheme).label}>
            {t('Expiration date') || 'Expiration date'}
          </TextDefault>
          <View style={styles(currentTheme).inputContainer}>
            <TextInput
              style={styles(currentTheme).input}
              placeholder={t('Expiration date (MM / YY)') || "Expiration date (MM / YY)"}
              placeholderTextColor="#9CA3AF"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>

          <TextDefault bold style={styles(currentTheme).label}>
            {t('CVV') || 'CVV'}
          </TextDefault>
          <View style={styles(currentTheme).inputContainer}>
            <TextInput
              style={styles(currentTheme).input}
              placeholder={t('Security code') || "Security code"}
              placeholderTextColor="#9CA3AF"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              maxLength={4}
            />
            <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
          </View>

        </View>
      </ScrollView>

      <View style={styles(currentTheme).footer}>
        <Button
          text={t('Save') || 'Save'}
          textStyles={styles(currentTheme).saveButtonText}
          buttonStyles={styles(currentTheme).saveButton}
          buttonProps={{
            onPress: () => navigation.goBack(),
            activeOpacity: 0.7
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default AddPaymentMethod
