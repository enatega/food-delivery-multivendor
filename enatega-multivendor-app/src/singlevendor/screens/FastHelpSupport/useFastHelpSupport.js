import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_SUPPORT_TICKET } from '../../apollo/mutations'
import { GET_SINGLE_USER_SUPPORT_TICKETS } from '../../apollo/queries'
import { useNavigation } from '@react-navigation/native'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSupportStore from '../../stores/useSupportStore'

const useFastHelpSupport = () => {
  const { profile } = useContext(UserContext)
  const { hasActiveTicket, setHasActiveTicket } = useSupportStore()

  // States
  const [userId, setUserId] = useState(profile?._id)
  const [ticketCategory, setTicketCategory] = useState(null)
  const [ticketSubCategory, setTicketSubCategory] = useState(null)

  // other constants
  const navigation = useNavigation()

  // Mutations & Queries

  const [createSupportTicket, { data: createSupportTicketData, error: createSupportTicketError, loading: createSupportTicketLoading }] = useMutation(CREATE_SUPPORT_TICKET, {
    onCompleted: (data) => {
      ticketRefetch()
      setHasActiveTicket(true)
      storeTicketTd(data?.createSupportTicket?._id)
      navigation?.navigate('HelpConversation')
    },
    onError: (error) => {
      FlashMessage({ message: error?.message })
    }
  })

  const {
    data: ticketData,
    error: ticketError,
    loading: ticketLoading,
    refetch: ticketRefetch
  } = useQuery(GET_SINGLE_USER_SUPPORT_TICKETS, {
    variables: {
      input: {
        userId,
        // Todo: can add pagination
        filters: {
          page: 1,
          limit: 100
        }
      }
    },
    fetchPolicy: 'network-only',
    skip: !userId
  })

  // Handlers

  const createSupportTicketHandler = (category, subcategory) => {
    createSupportTicket({
      variables: {
        ticketInput: {
          title: subcategory, // *
          description: subcategory, // *
          category: category, // *
          orderId: null,
          otherDetails: subcategory,
          userType: 'User' // *
        }
      },
      skip: !subcategory || !category
    })
  }

  const categoryOnPressHandler = (category) => {
    setTicketCategory(() => category)
    navigation?.navigate('AccountHelp', { category })
  }

  const subCategoryOnPressHandler = async (subCategory, category) => {
    setTicketSubCategory(subCategory)
    createSupportTicketHandler(category, subCategory)
  }

  const findActiveTicketandSetTicketId = () => {
    const item = ticketData?.getSingleUserSupportTickets?.tickets.find((e) => e.status !== 'closed') ?? null
    if (item) {
      storeTicketTd(item?._id)
      setHasActiveTicket(true)
    } else {
      storeTicketTd(null)
      setHasActiveTicket(false)
    }
  }

  const storeTicketTd = async (value) => {
    if (value) {
      try {
        await AsyncStorage.setItem('ticketId', value)
      } catch (error) {
        await AsyncStorage.removeItem('ticketId')
        console.log('storeTicketTd - error', error)
      }
    }
  }

  const getTicketTd = async () => {
    try {
      return await AsyncStorage.getItem('ticketId')
    } catch (error) {
      console.log('storeTicketTd - error', error)
      return null
    }
  }

  useEffect(() => {
    if (ticketData?.getSingleUserSupportTickets?.tickets) {
      findActiveTicketandSetTicketId()
    }
  }, [ticketData?.getSingleUserSupportTickets?.tickets])

  return {
    userId,
    setUserId,

    hasActiveTicket,

    ticketCategory,
    setTicketCategory,

    ticketSubCategory,
    setTicketSubCategory,

    createSupportTicketData,
    createSupportTicketError,
    createSupportTicketLoading,

    ticketData: ticketData?.getSingleUserSupportTickets?.tickets,
    ticketError,
    ticketLoading,
    ticketRefetch,

    categoryOnPressHandler,
    subCategoryOnPressHandler,

    storeTicketTd,
    getTicketTd
  }
}

export default useFastHelpSupport
