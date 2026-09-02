import React, { useState, useEffect, useContext, useLayoutEffect, useCallback } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons'
import { callNumber } from '../../utils/callNumber'
import gql from 'graphql-tag'
import { chat } from '../../apollo/queries'
import { subscriptionNewMessage } from '../../apollo/subscriptions'
import { sendChatMessage, uploadImageToS3 } from '../../apollo/mutations'
import { useMutation, useQuery } from '@apollo/client'
import { Alert, Platform, StatusBar, View } from 'react-native'
import { useUserContext } from '../../context/User'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../utils/alignment'
import { useFocusEffect } from '@react-navigation/native'

export const useChatScreen = ({ navigation, route }) => {
  const { id: orderId, orderNo, total, riderPhone } = route.params

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
  const [uploadImage] = useMutation(
    gql`
      ${uploadImageToS3}
    `,
    { onError }
  )
  const [uploading, setUploading] = useState(false)

  const mapChatMessage = useCallback((message) => ({
    _id: message.id,
    text: message.message || '',
    image: message.image || undefined,
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
    user: {
      _id: message.user.id,
      name: message.user.name
    }
  }), [])

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.chat.map(mapChatMessage))
    }
  }, [chatData, mapChatMessage])

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
            onPress={() => callNumber(riderPhone)}
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
  }, [orderId, subscribeToMessages])
  const onSend = () => {
    if (!inputMessage?.trim()) return

    const newMessage = {
      _id: Date.now().toString(),
      text: inputMessage.trim(),
      createdAt: new Date(),
      user: {
        _id: profile._id,
        name: profile.name
      }
    }

    // Optimistically update messages
    setMessages(previousMessages => [newMessage, ...previousMessages])

    send({
      variables: {
        orderId: orderId,
        messageInput: {
          message: inputMessage.trim(),
          user: {
            id: profile._id,
            name: profile.name
          }
        }
      }
    })
    setInputMessage('')
    setImage([])
  }

  // Optimistically add an image-only message, then persist it.
  const sendImageMessage = (imageUrl, localPreviewUri) => {
    const newMessage = {
      _id: Date.now().toString(),
      text: '',
      image: imageUrl,
      localImage: localPreviewUri || undefined,
      createdAt: new Date(),
      user: {
        _id: profile._id,
        name: profile.name
      }
    }
    setMessages(previousMessages => [newMessage, ...previousMessages])
    send({
      variables: {
        orderId: orderId,
        messageInput: {
          message: '',
          image: imageUrl,
          user: {
            id: profile._id,
            name: profile.name
          }
        }
      }
    })
  }

  // Pick from gallery -> upload to S3 -> send the returned URL.
  const pickImage = async () => {
    // Lazy-require so merely opening the chat never touches the native module.
    // (It throws at import if the dev client wasn't rebuilt with expo-image-picker.)
    let ImagePicker
    try {
      ImagePicker = require('expo-image-picker')
    } catch (e) {
      Alert.alert(t('permissionRequired'), t('imagePickerUnavailable'))
      return
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(t('permissionRequired'), t('galleryPermissionMessage'))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true
    })
    if (result.canceled) return
    const asset = result.assets?.[0]
    if (!asset?.base64) return
    try {
      setUploading(true)
      const { data } = await uploadImage({ variables: { image: `data:image/jpeg;base64,${asset.base64}` } })
      const imageUrl = data?.uploadImageToS3?.imageUrl
      if (!imageUrl) throw new Error(t('imageUploadFailed'))
      sendImageMessage(imageUrl, asset.uri)
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setUploading(false)
    }
  }

  return {
    messages,
    onSend,
    pickImage,
    uploading,
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
