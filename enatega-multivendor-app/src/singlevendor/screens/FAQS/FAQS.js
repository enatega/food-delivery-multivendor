import React, { useContext, useState } from 'react'
import { SafeAreaView, ScrollView, View, TouchableOpacity, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
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

  const AccordionItem = ({ icon, iconColor, question, children, index }) => {
    const [expanded, setExpanded] = useState(false)
    const [animation] = useState(new Animated.Value(0))

    const toggleExpand = () => {
      const toValue = expanded ? 0 : 1
      Animated.spring(animation, {
        toValue,
        useNativeDriver: false,
        friction: 8
      }).start()
      setExpanded(!expanded)
    }

    const rotateInterpolate = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })

    return (
      <View style={styles(currentTheme).accordionCard}>
        <TouchableOpacity 
          style={styles(currentTheme).accordionHeader}
          onPress={toggleExpand}
          activeOpacity={0.7}
        >
          <View style={styles(currentTheme).accordionHeaderLeft}>
            <View style={[styles(currentTheme).iconContainer, { backgroundColor: iconColor + '15' }]}>
              <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
            </View>
            <TextDefault 
              textColor={currentTheme.fontMainColor} 
              style={styles(currentTheme).questionText}
              bold
            >
              {question}
            </TextDefault>
          </View>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={currentTheme.fontSecondColor} 
            />
          </Animated.View>
        </TouchableOpacity>
        
        {expanded && (
          <View style={styles(currentTheme).accordionContent}>
            {children}
          </View>
        )}
      </View>
    )
  }

  const BulletPoint = ({ text }) => (
    <View style={styles(currentTheme).bulletItem}>
      <View style={styles(currentTheme).bulletDot} />
      <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).bulletText}>
        {text}
      </TextDefault>
    </View>
  )

  const InfoCard = ({ icon, title, description, color }) => (
    <View style={[styles(currentTheme).infoCard, { borderLeftColor: color }]}>
      <View style={[styles(currentTheme).infoIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles(currentTheme).infoCardContent}>
        <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).infoCardTitle} bold>
          {title}
        </TextDefault>
        <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).infoCardDescription}>
          {description}
        </TextDefault>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} />
      <ScrollView 
        style={styles(currentTheme).scrollView} 
        contentContainerStyle={styles(currentTheme).scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(currentTheme).content}>
          {/* Hero Section */}
          <View style={styles(currentTheme).heroSection}>
            <View style={styles(currentTheme).heroIconContainer}>
              <Ionicons name="help-circle" size={32} color={currentTheme.main || '#90E36D'} />
            </View>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).pageTitle} bolder>
              {t('Frequently Asked Questions')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).pageSubtitle}>
              {t('Everything you need to know about FAST')}
            </TextDefault>
          </View>

          {/* Quick Stats */}
          <View style={styles(currentTheme).statsContainer}>
            <View style={styles(currentTheme).statItem}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).statText}>
                {t('Secure')}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).statDivider} />
            <View style={styles(currentTheme).statItem}>
              <Ionicons name="time" size={20} color="#F59E0B" />
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).statText}>
                {t('24/7 Support')}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).statDivider} />
            <View style={styles(currentTheme).statItem}>
              <Ionicons name="people" size={20} color="#3B82F6" />
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).statText}>
                {t('Trusted')}
              </TextDefault>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles(currentTheme).sectionHeader}>
            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).sectionTitle} bold>
              {t('Common Questions')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).sectionSubtitle}>
              {t('Tap any question to view the answer')}
            </TextDefault>
          </View>

          {/* FAQ Accordions */}
          <View style={styles(currentTheme).accordionContainer}>
            <AccordionItem 
              icon="database-outline" 
              iconColor="#3B82F6"
              question={t('What information do we collect?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t('When you use FAST, we may collect the following types of information:')}
              </TextDefault>
              <View style={styles(currentTheme).bulletList}>
                <BulletPoint text={t('Account Information: Your name, email, password, and any other details you provide during registration.')} />
                <BulletPoint text={t('Orders & Preferences: The orders you place, your delivery address, and any preferences you save.')} />
                <BulletPoint text={t('Device & Technical Data: Information about your device, operating system, app version, IP address, and usage statistics to improve our services.')} />
                <BulletPoint text={t('Support & Communication: Any messages or feedback you send us.')} />
                <BulletPoint text={t('Optional Information: Preferences or settings you adjust in the app.')} />
              </View>
            </AccordionItem>

            <AccordionItem 
              icon="cog-outline" 
              iconColor="#8B5CF6"
              question={t('How do we use your information?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t('We use your information for several purposes, including:')}
              </TextDefault>
              <View style={styles(currentTheme).bulletList}>
                <BulletPoint text={t('Order Fulfillment: To process your orders and arrange delivery.')} />
                <BulletPoint text={t('Account Management: To authenticate users and manage accounts.')} />
                <BulletPoint text={t('Improvement & Personalization: To enhance your experience with FAST.')} />
                <BulletPoint text={t('Security & Safety: To prevent fraud and unauthorized access.')} />
                <BulletPoint text={t('Legal Compliance: To adhere to applicable laws.')} />
                <BulletPoint text={t('Communication: To send you updates and confirmations.')} />
              </View>
            </AccordionItem>

            <AccordionItem 
              icon="share-variant-outline" 
              iconColor="#10B981"
              question={t('How do we share your information?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t('We respect your privacy and do not sell your personal data. We may share your information in the following cases:')}
              </TextDefault>
              <View style={styles(currentTheme).bulletList}>
                <BulletPoint text={t('With Your Consent: When you authorize data sharing.')} />
                <BulletPoint text={t('Service Providers: With trusted third parties for delivery, payment processing, or support.')} />
                <BulletPoint text={t('Legal Requirements: If required by law.')} />
                <BulletPoint text={t('Protection: To safeguard the rights and safety of FAST and our users.')} />
              </View>
            </AccordionItem>

            <AccordionItem 
              icon="shield-check-outline" 
              iconColor="#EF4444"
              question={t('How do we ensure data security?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t("We implement industry-standard measures like encryption and secure servers to protect your data. While we strive to secure your information, no method is completely foolproof. We recommend using strong passwords and maintaining your device's security.")}
              </TextDefault>
            </AccordionItem>

            <AccordionItem 
              icon="account-check-outline" 
              iconColor="#F59E0B"
              question={t('What rights do you have?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t('Depending on your location, you may have the following rights:')}
              </TextDefault>
              <View style={styles(currentTheme).bulletList}>
                <BulletPoint text={t('Access: Request a copy of your personal data.')} />
                <BulletPoint text={t('Correction: Update or correct inaccurate information.')} />
                <BulletPoint text={t('Deletion: Request the deletion of your orders and account.')} />
                <BulletPoint text={t('Restriction: Limit certain processing of your data.')} />
                <BulletPoint text={t('Portability: Request your data in a portable format.')} />
                <BulletPoint text={t('Opt-Out: Unsubscribe from marketing communications.')} />
              </View>
            </AccordionItem>

            <AccordionItem 
              icon="update" 
              iconColor="#06B6D4"
              question={t('Will this FAQ change?')}
            >
              <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).answerText}>
                {t('We may update this FAQ section periodically. If significant changes occur, we will notify you through the app or by email. Please check back regularly to stay informed.')}
              </TextDefault>
            </AccordionItem>
          </View>

          {/* Contact Section */}
          <View style={styles(currentTheme).contactSection}>
            <View style={styles(currentTheme).contactHeader}>
              <Ionicons name="chatbubble-ellipses" size={24} color={currentTheme.main || '#90E36D'} />
              <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).contactTitle} bold>
                {t('Still have questions?')}
              </TextDefault>
            </View>
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).contactDescription}>
              {t("Can't find the answer you're looking for? Our support team is here to help.")}
            </TextDefault>
            
            <InfoCard 
              icon="mail" 
              title={t('Email Support')}
              description="support@fastapp.com"
              color={currentTheme.lightBlue || '#3B82F6'}
            />
          </View>

          {/* Footer Note */}
          <View style={styles(currentTheme).footerNote}>
            <Ionicons name="time-outline" size={16} color={currentTheme.fontSecondColor} />
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).footerText}>
              {t('Last updated 2 months ago')}
            </TextDefault>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FAQS
