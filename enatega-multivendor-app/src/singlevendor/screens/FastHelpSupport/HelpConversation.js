import React, { useContext, useState } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import useHelpConversation from './useHelpConversation'

import styles from './helpConversationStyles'
import MessageBubble from './MessageBubble'
import Spinner from '../../../components/Spinner/Spinner'

const HelpConversation = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const { message, setMessage, ticketMessagesData, ticketMessagesError, ticketMessagesLoading, createMessageHandler, ticketStatus, createMessageLoading, supportMessages } = useHelpConversation()

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
      title: t("My courier hasn't arrived yet"),
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
      title: t('I want a refund'),
      onPress: () => {
        setMessage('I want a refund')
      }
    },
    {
      id: 'overcharged',
      title: t('I was overcharged'),
      onPress: () => {
        setMessage('I was overcharged')
      }
    },
    {
      id: 'cant-contact',
      title: t("I can't contact my courier"),
      onPress: () => {
        setMessage("I can't contact my courier")
      }
    }
  ]

  const handleSend = () => {
    if (message.trim()) {
      createMessageHandler()
    }
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader currentTheme={currentTheme} onBack={() => navigation.goBack()} headerText={t('FAST help') || 'FAST help'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles(currentTheme).keyboardView} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles(currentTheme).scrollContent}>
          {ticketMessagesLoading ? (
            <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner spinnerColor={currentTheme?.primaryBlue} />
            </View>
          ) : ticketMessagesError ? (
            <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <TextDefault bold H5 textColor={currentTheme?.red600}>
                {t('Something went wrong, please try again!')}
              </TextDefault>
            </View>
          ) : (
            <>
              {(supportMessages?.length === 0) ? (
                  <View style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                  </View>
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={supportMessages}
                    keyExtractor={(item) => item?._id}
                    renderItem={({ item }) => <MessageBubble item={item} status={ticketStatus} />}
                    inverted // Todo: the sorting can be added on backend but for now i am reversing the array so that we see the latest first.
                  />
                )}
            </>
          )}
        </View>

        <View style={styles(currentTheme).inputContainer}>
          <View style={styles(currentTheme).TextInputContainer}>
            <TextInput style={styles(currentTheme).textInput} placeholder={t('Enter your concern...') || 'Enter your concern...'} placeholderTextColor={currentTheme.fontSecondColor} value={message} onChangeText={setMessage} multiline />
          </View>
          <View style={styles(currentTheme).inputContainerInner}>
            <TouchableOpacity style={styles(currentTheme).attachButton} activeOpacity={0.7}>
              {/* Todo: can add files features later */}
              {/* <Ionicons name='add' size={scale(24)} color={currentTheme.iconColor || currentTheme.fontSecondColor} /> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles(currentTheme).sendButton} onPress={handleSend} activeOpacity={0.7} disabled={!message.trim() || createMessageLoading}>
              <Ionicons name='paper-plane' size={scale(20)} color={!message.trim() || createMessageLoading ? currentTheme.fontSecondColor || '#C0C0C0' : currentTheme.primaryBlue || '#007AFF'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default HelpConversation
