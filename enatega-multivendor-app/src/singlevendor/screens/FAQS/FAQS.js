import React, { useContext } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from './styles'

const FAQS = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} />
      <ScrollView style={styles(currentTheme).scrollView} contentContainerStyle={styles(currentTheme).scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles(currentTheme).content}>
         
          <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionHeader} bolder>
            {t('Frequently Asked Questions')}
          </TextDefault>

          <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).lastUpdated}>
            {t('Last updated 2 months ago') || 'Last updated 2 months ago'}
          </TextDefault>

          <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).introText}>
            {t('At FAST, we prioritize your experience and trust. This FAQ section provides answers to common questions about using our app. By using FAST, you can find the information you need to enhance your experience.') || 'At FAST, we prioritize your experience and trust. This FAQ section provides answers to common questions about using our app. By using FAST, you can find the information you need to enhance your experience.'}
          </TextDefault>

          {/* Section 1: What information do we collect? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('What information do we collect?') || 'What information do we collect?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionIntro}>
              {t('When you use FAST, we may collect the following types of information:') || 'When you use FAST, we may collect the following types of information:'}
            </TextDefault>
            <View style={styles(currentTheme).bulletList}>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Account Information: Your name, email, password, and any other details you provide during registration.') || 'Account Information: Your name, email, password, and any other details you provide during registration.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Orders & Preferences: The orders you place, your delivery address, and any preferences you save.') || 'Orders & Preferences: The orders you place, your delivery address, and any preferences you save.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Device & Technical Data: Information about your device, operating system, app version, IP address, and usage statistics to improve our services.') || 'Device & Technical Data: Information about your device, operating system, app version, IP address, and usage statistics to improve our services.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Support & Communication: Any messages or feedback you send us.') || 'Support & Communication: Any messages or feedback you send us.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Optional Information: Preferences or settings you adjust in the app.') || 'Optional Information: Preferences or settings you adjust in the app.'}
                </TextDefault>
              </View>
            </View>
          </View>

          {/* Section 2: How do we use your information? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('How do we use your information?') || 'How do we use your information?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionIntro}>
              {t('We use your information for several purposes, including:') || 'We use your information for several purposes, including:'}
            </TextDefault>
            <View style={styles(currentTheme).bulletList}>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Order Fulfillment: To process your orders and arrange delivery.') || 'Order Fulfillment: To process your orders and arrange delivery.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Account Management: To authenticate users and manage accounts.') || 'Account Management: To authenticate users and manage accounts.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Improvement & Personalization: To enhance your experience with FAST.') || 'Improvement & Personalization: To enhance your experience with FAST.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Security & Safety: To prevent fraud and unauthorized access.') || 'Security & Safety: To prevent fraud and unauthorized access.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Legal Compliance: To adhere to applicable laws.') || 'Legal Compliance: To adhere to applicable laws.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Communication: To send you updates and confirmations.') || 'Communication: To send you updates and confirmations.'}
                </TextDefault>
              </View>
            </View>
          </View>

          {/* Section 3: How do we share your information? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('How do we share your information?') || 'How do we share your information?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionIntro}>
              {t('We respect your privacy and do not sell your personal data. We may share your information in the following cases:') || 'We respect your privacy and do not sell your personal data. We may share your information in the following cases:'}
            </TextDefault>
            <View style={styles(currentTheme).bulletList}>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('With Your Consent: When you authorize data sharing.') || 'With Your Consent: When you authorize data sharing.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Service Providers: With trusted third parties for delivery, payment processing, or support.') || 'Service Providers: With trusted third parties for delivery, payment processing, or support.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Legal Requirements: If required by law.') || 'Legal Requirements: If required by law.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Protection: To safeguard the rights and safety of FAST and our users.') || 'Protection: To safeguard the rights and safety of FAST and our users.'}
                </TextDefault>
              </View>
            </View>
          </View>

          {/* Section 4: How do we ensure data security? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('How do we ensure data security?') || 'How do we ensure data security?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionParagraph}>
              {t("We implement industry-standard measures like encryption and secure servers to protect your data. While we strive to secure your information, no method is completely foolproof. We recommend using strong passwords and maintaining your device's security.") || "We implement industry-standard measures like encryption and secure servers to protect your data. While we strive to secure your information, no method is completely foolproof. We recommend using strong passwords and maintaining your device's security."}
            </TextDefault>
          </View>

          {/* Section 5: What rights do you have? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('What rights do you have?') || 'What rights do you have?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionIntro}>
              {t('Depending on your location, you may have the following rights:') || 'Depending on your location, you may have the following rights:'}
            </TextDefault>
            <View style={styles(currentTheme).bulletList}>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Access: Request a copy of your personal data.') || 'Access: Request a copy of your personal data.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Correction: Update or correct inaccurate information.') || 'Correction: Update or correct inaccurate information.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Deletion: Request the deletion of your orders and account.') || 'Deletion: Request the deletion of your orders and account.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Restriction: Limit certain processing of your data.') || 'Restriction: Limit certain processing of your data.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Portability: Request your data in a portable format.') || 'Portability: Request your data in a portable format.'}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).bulletItem}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bullet}>
                  {'- '}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).bulletText}>
                  {t('Opt-Out: Unsubscribe from marketing communications.') || 'Opt-Out: Unsubscribe from marketing communications.'}
                </TextDefault>
              </View>
            </View>
          </View>

          {/* Section 6: Will this FAQ change? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('Will this FAQ change?') || 'Will this FAQ change?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionParagraph}>
              {t('We may update this FAQ section periodically. If significant changes occur, we will notify you through the app or by email. Please check back regularly to stay informed.') || 'We may update this FAQ section periodically. If significant changes occur, we will notify you through the app or by email. Please check back regularly to stay informed.'}
            </TextDefault>
          </View>

          {/* Section 7: How can you contact us? */}
          <View style={styles(currentTheme).section}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bolder>
              {t('How can you contact us?') || 'How can you contact us?'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionParagraph}>
              {t('If you have any questions or concerns regarding this FAQ, please reach out to us at:') || 'If you have any questions or concerns regarding this FAQ, please reach out to us at:'}
            </TextDefault>
            <View style={styles(currentTheme).contactInfo}>
              <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).contactText}>
                {'✉️ '}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).contactText}>
                {t('Email: support@fastapp.com') || 'Email: support@fastapp.com'}
              </TextDefault>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FAQS
