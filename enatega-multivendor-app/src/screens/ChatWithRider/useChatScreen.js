import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { callNumber } from '../../utils/callNumber'
import gql from 'graphql-tag'
import { chat } from '../../apollo/queries'
import { subscriptionNewMessage } from '../../apollo/subscriptions'
import { sendChatMessage } from '../../apollo/mutations'
import { useMutation, useQuery } from '@apollo/client'
import { Alert, Platform, StatusBar, View } from 'react-native'
import { useUserContext } from '../../context/User'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import { useFocusEffect } from '@react-navigation/native'

export const useChatScreen = ({ navigation, route }) => {
  const { id: orderId, orderNo, total } = route.params

  const { t } = useTranslation()
  const { profile } = useUserContext()
  const { subscribeToMore: subscribeToMessages, data: chatData } = useQuery(
    gql`
      ${chat}
    `,
    {
      variables: { order: orderId },
      fetchPolicy: 'network-only',
      onError
    }
  )
  const [send] = useMutation(
    gql`
      ${sendChatMessage}
    `,
    {
      onCompleted,
      onError
    }
  )
  useEffect(() => {
    if (chatData) {
      setMessages(
        chatData.chat.map(message => ({
          _id: message.id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user.id,
            name: message.user.name
          }
        }))
      )
    }
  }, [chatData])

  function onCompleted({ sendChatMessage: messageResult }) {
    if (!messageResult?.success) {
      Alert.alert('Error', messageResult.message)
    }
  }
  function onError(error) {
    Alert.alert('Error', error.message)
  }
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState(null)
  const [image, setImage] = useState([])
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.headerMenuBackground
      },
      headerTitleStyle: {
        fontSize: 14,
        // fontWeight: '700',
        color: currentTheme.fontFourthColor
      },
      headerLeft: () => (
        <View
          style={{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: currentTheme.fontFourthColor,
            ...alignment.MLmedium
          }}>
          <Entypo
            name="cross"
            size={20}
            color={currentTheme.fontFourthColor}
            onPress={() => navigation.goBack()}
          />
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            ...alignment.MRmedium
          }}>
          <Ionicons
            name="call-outline"
            size={24}
            color={currentTheme.fontFourthColor}
            onPress={() => callNumber('+923159499378')}
          />
        </View>
      ),
      headerTitle: t('contactYourRider')
    })
  }, [navigation])
  useEffect(() => {
    const unsubscribe = subscribeToMessages({
      document: gql`
        ${subscriptionNewMessage}
      `,
      variables: { order: orderId },

      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          chat: [subscriptionData.data.subscriptionNewMessage, ...prev.chat]
        }
      }
    })
    return unsubscribe
  })
  const onSend = () => {
    send({
      variables: {
        orderId: orderId,
        messageInput: {
          message: inputMessage,
          user: {
            id: profile._id,
            name: profile.name
          }
        }
      }
    })
    setInputMessage(null)
    setImage([])
  }

  return {
    messages,
    onSend,
    currentTheme,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile,
    orderNo,
    total
  }
}
