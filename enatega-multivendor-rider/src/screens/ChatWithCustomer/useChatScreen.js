import React, { useState, useEffect, useLayoutEffect, useContext} from 'react'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { callNumber } from '../../utilities/callNumber'
import colors from '../../utilities/colors'
import { Alert } from 'react-native'
import { chat } from '../../apollo/queries'
import { sendChatMessage } from '../../apollo/mutations'
import { subscriptionNewMessage } from '../../apollo/subscriptions'
import { gql, useMutation, useQuery } from '@apollo/client'
import UserContext from '../../context/user'
import { useTranslation } from 'react-i18next'

export const useChatScreen = ({ navigation, route }) => {
  const {t} = useTranslation()
  const { dataProfile } = useContext(UserContext)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState(null)
  const [image, setImage] = useState([])
  const [phone] = useState(route.params?.phoneNumber)
  const { id: orderId } = route.params
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
    { onCompleted, onError }
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.white
      },
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary
      },
      headerLeft: () => (
        <Ionicons
          name="chevron-back"
          size={26}
          color={colors.white}
          style={{
            marginLeft: 10,
            backgroundColor: colors.black,
            borderRadius: 5,
            overflow: 'hidden'
          }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <FontAwesome5
          name="phone-alt"
          size={20}
          color={colors.white}
          style={{
            marginRight: 10,
            backgroundColor: colors.black,
            padding: 3,
            borderRadius: 5,
            overflow: 'hidden'
          }}
          onPress={() => callNumber(phone)}
        />
      ),
      headerTitle: t('contactCustomer')
    })
  }, [navigation])

  const onSend = () => {
    send({
      variables: {
        orderId: orderId,
        messageInput: {
          message: inputMessage,
          user: {
            id: dataProfile.rider._id,
            name: dataProfile.rider.name
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
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile: dataProfile
  }
}
