import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_MESSAGE } from '../../apollo/mutations'
import { GET_TICKET_MESSAGES } from '../../apollo/queries'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSupportStore from '../../stores/useSupportStore'

const useHelpConversation = () => {
  const [message, setMessage] = useState('')
  const [ticketId, setticketId] = useState(null)

  const { supportMessages, addMessage, setSupportMessages, setHasActiveTicket } = useSupportStore()

  useEffect(() => {
    const loadTicketId = async () => {
      const id = await AsyncStorage.getItem('ticketId')
      setticketId(id)
    }
    loadTicketId()
  }, [])

  // Mutations & Queries
  const [createMessage, { data: createMessageData, error: createMessageError, loading: createMessageLoading }] = useMutation(CREATE_MESSAGE, {
    onCompleted: (data) => {
      console.log('createMessage - onComplete', JSON.stringify(data?.createMessage, null, 2))
      setMessage('')
      addMessage(data?.createMessage)
      setHasActiveTicket(true)
    },
    onError: (error) => {
      console.log('createMessage - onError', error)
    }
  })

  const {
    data: ticketMessagesData,
    error: ticketMessagesError,
    loading: ticketMessagesLoading
  } = useQuery(GET_TICKET_MESSAGES, {
    variables: {
      input: {
        ticket: ticketId
      }
    },
    skip: !ticketId,
    fetchPolicy: 'network-only',
    pollInterval: 10000
  })

  useEffect(() => {
    setSupportMessages(ticketMessagesData?.getTicketMessages?.messages)
  }, [ticketMessagesData?.getTicketMessages])

  // Handlers

  const createMessageHandler = () => {
    createMessage({
      variables: {
        messageInput: {
          content: message,
          ticket: ticketId
        }
      }
    })
  }

  return {
    message,
    setMessage,

    createMessageData,
    createMessageError,
    createMessageLoading,
    createMessageHandler,

    ticketMessagesData: ticketMessagesData?.getTicketMessages || [],
    ticketMessagesError,
    ticketMessagesLoading,
    ticketStatus: ticketMessagesData?.ticket?.status,
    supportMessages
  }
}

export default useHelpConversation
