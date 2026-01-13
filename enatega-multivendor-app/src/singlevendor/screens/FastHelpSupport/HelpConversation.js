import React, { useContext, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

import styles from './helpConversationStyles'

const HelpConversation = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [message, setMessage] = useState('')

  // Get current time in 12-hour format
  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  const quickActions = [
    {
      id: 'courier-not-arrived',
      title: t("My courier hasn't arrived yet") ,
      onPress: () => {
        setMessage("My courier hasn't arrived yet")
      }
    },
    {
      id: 'delivery-help',
      title: t('I need help with my delivery'),
      onPress: () => {
        setMessage('I need help with my delivery')
      }
    },
    {
      id: 'refund',
      title: t('I want a refund') ,
      onPress: () => {
        setMessage('I want a refund')
      }
    },
    {
      id: 'overcharged',
      title: t('I was overcharged') ,
      onPress: () => {
        setMessage('I was overcharged')
      }
    },
    {
      id: 'cant-contact',
      title: t("I can't contact my courier") ,
      onPress: () => {
        setMessage("I can't contact my courier")
      }
    }
  ]

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message logic here
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('FAST help') || 'FAST help'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles(currentTheme).keyboardView} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView style={styles(currentTheme).scrollView} contentContainerStyle={styles(currentTheme).scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles(currentTheme).messageContainer}>
            <View style={styles(currentTheme).messageBubble}>
              <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).messageText}>
                {t('How can we help you? [Automessage]')}
              </TextDefault>
            </View>
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles(currentTheme).timestamp} small>
              {getCurrentTime()}
            </TextDefault>
          </View>

          <View style={styles(currentTheme).quickActionsContainer}>
            <TouchableOpacity style={[styles(currentTheme).quickActionButton, styles(currentTheme).firstRowButton]} onPress={quickActions[0].onPress} activeOpacity={0.7}>
              <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).quickActionText}>
                {quickActions[0].title}
              </TextDefault>
            </TouchableOpacity>

            <View style={styles(currentTheme).buttonsRowLeft}>
              <TouchableOpacity style={styles(currentTheme).quickActionButtonNoMargin} onPress={quickActions[1].onPress} activeOpacity={0.7}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).quickActionText}>
                  {quickActions[1].title}
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity style={styles(currentTheme).quickActionButtonNoMargin} onPress={quickActions[2].onPress} activeOpacity={0.7}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).quickActionText}>
                  {quickActions[2].title}
                </TextDefault>
              </TouchableOpacity>
            </View>
            <View style={styles(currentTheme).buttonsRowLeft}>
              <TouchableOpacity style={styles(currentTheme).quickActionButtonNoMargin} onPress={quickActions[3].onPress} activeOpacity={0.7}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).quickActionText}>
                  {quickActions[3].title}
                </TextDefault>
              </TouchableOpacity>
              <TouchableOpacity style={styles(currentTheme).quickActionButtonNoMargin} onPress={quickActions[4].onPress} activeOpacity={0.7}>
                <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).quickActionText}>
                  {quickActions[4].title}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles(currentTheme).inputContainer}>
          <View style={styles(currentTheme).TextInputContainer}>
           
            <TextInput style={styles(currentTheme).textInput} placeholder={t('Enter your concern...') || 'Enter your concern...'} placeholderTextColor={currentTheme.fontSecondColor} value={message} onChangeText={setMessage} multiline />
          </View>
          <View style={styles(currentTheme).inputContainerInner}>
            <TouchableOpacity style={styles(currentTheme).attachButton} activeOpacity={0.7}>
              <Ionicons name='add' size={scale(24)} color={currentTheme.iconColor || currentTheme.fontSecondColor} />
            </TouchableOpacity>

            <TouchableOpacity style={styles(currentTheme).sendButton} onPress={handleSend} activeOpacity={0.7} disabled={!message.trim()}>
              <Ionicons name='paper-plane' size={scale(20)} color={message.trim() ? currentTheme.primary || '#007AFF' : currentTheme.fontSecondColor || '#C0C0C0'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default HelpConversation
