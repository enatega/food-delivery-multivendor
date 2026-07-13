import { StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native'
import React, { useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const ContactEmailCard = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const SUPPORT_EMAIL = 'hilfe@befast.io'
  const handleEmailPress = () => {
    const url = `mailto:${SUPPORT_EMAIL}`
    const support = Linking.canOpenURL(url)

    if (support) {
      Linking.openURL(url)
    } else {
      Alert.alert(t('Email Not Available'), t('No email app found on this device.'))
    }
  }
  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).card}>
        <Text style={styles(currentTheme).title}>{t('Need assistance')}</Text>
        <Text style={styles(currentTheme).description}>{t('Please contact our support team via email and we will get back to you as soon as possible')}</Text>

        <TouchableOpacity style={styles(currentTheme).emailContainer} activeOpacity={0.7} onPress={handleEmailPress}>
          <Ionicons name='mail-outline' size={20} color={currentTheme.primaryBlue} />
          <Text style={styles(currentTheme).email}>{SUPPORT_EMAIL}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ContactEmailCard

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30
    },
    card: {
      backgroundColor: currentTheme ? currentTheme.themeBackground : '#fff',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4 // Android shadow
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10
    },
    description: {
      fontSize: 14,
      color: currentTheme ? currentTheme.fontFifthColor : '#9CA3AF',
      marginBottom: 20,
      lineHeight: 20
    },
    emailContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    email: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: '500',
      color: currentTheme ? currentTheme?.primaryBlue : '#0EA5E9'
    }
  })
