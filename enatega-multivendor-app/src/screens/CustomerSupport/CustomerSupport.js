import React, { useContext, useEffect, useMemo, useState } from 'react'
import { View, StatusBar, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../Help/styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Analytics from '../../utils/analytics'
import { useFocusEffect } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { scale } from '../../utils/scaling'
import { useTranslation } from 'react-i18next'
import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import UserContext from '../../context/User'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useQuery } from '@apollo/client'
import { GET_USER_SUPPORT_TICKETS } from '../../apollo/queries'
import SupportTicketModal from '../../components/Help/SupportTicketModal'
import SupportChatModal from '../../components/Help/SupportChatModal'

const CustomerSupport = (props) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { isLoggedIn, profile } = useContext(UserContext)
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false)
  const [isChatModalVisible, setIsChatModalVisible] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const { data: ticketsData, loading: ticketsLoading, refetch: refetchTickets } = useQuery(
    GET_USER_SUPPORT_TICKETS,
    {
      variables: {
        input: {
          userId: profile?._id,
          filters: {
            page: 1,
            limit: 10
          }
        }
      },
      skip: !isLoggedIn || !profile?._id,
      fetchPolicy: 'network-only',
      onError: (error) => {
        FlashMessage({
          message: error?.message || 'Failed to load support tickets',
          duration: 3000
        })
      }
    }
  )

  const tickets = ticketsData?.getSingleUserSupportTickets?.tickets || []
  const sortedTickets = useMemo(
    () =>
      [...tickets].sort((a, b) => {
        const dateA = new Date(Number(a.updatedAt || a.createdAt || 0)).getTime()
        const dateB = new Date(Number(b.updatedAt || b.createdAt || 0)).getTime()
        return dateB - dateA
      }),
    [tickets]
  )
  const activeSupportTicket = useMemo(
    () => sortedTickets.find((ticket) => ['open', 'inProgress'].includes(ticket?.status)),
    [sortedTickets]
  )

  const formatDate = (dateString) => {
    try {
      const date = new Date(Number(dateString))
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return ''
    }
  }

  const openSupportComposer = () => {
    if (!isLoggedIn) {
      FlashMessage({ message: t('loginRequired', 'Please login to contact support') })
      props?.navigation.navigate('Login')
      return
    }

    if (activeSupportTicket) {
      setSelectedTicket(activeSupportTicket)
      setIsChatModalVisible(true)
      FlashMessage({
        message: t(
          'open_support_ticket_hint',
          'You already have an open support chat. Continuing that conversation now.'
        ),
        duration: 2500
      })
      return
    }

    setIsTicketModalVisible(true)
  }

  const openChatForTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsChatModalVisible(true)
  }

  const handleTicketCreated = (ticket) => {
    if (!ticket) return
    refetchTickets?.()
    setSelectedTicket(ticket)
    setIsChatModalVisible(true)
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    async function Track() {
      try {
        await Analytics.track('NAVIGATE_TO_CUSTOMER_SUPPORT')
      } catch (err) {
        // ignore analytics failure
      }
    }
    Track()
  }, [])

  useEffect(() => {
    props?.navigation.setOptions({
      headerTitle: t('CustomerSupport'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons name='arrow-back' size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation, currentTheme, t])

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <SafeAreaView edges={['bottom', 'right', 'left']} style={styles(currentTheme).flex}>
      <StatusBar barStyle='light-content' backgroundColor={currentTheme.themeBackground} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).mainContainer}
      >
        <View style={styles(currentTheme).supportCard}>
          <TextDefault textColor={currentTheme.fontMainColor} bold H4>
            {t('still_need_help_label', 'Still need help?')}
          </TextDefault>
          <TextDefault textColor={currentTheme.secondaryText} style={styles(currentTheme).supportSubText}>
            {t(
              'support_team_available_message',
              'Send a message to our support team and continue the conversation in-app.'
            )}
          </TextDefault>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles(currentTheme).supportButton}
            onPress={openSupportComposer}
          >
            <MaterialIcons name='chat' size={20} color={currentTheme.color4} />
            <TextDefault textColor={currentTheme.color4} bold style={styles(currentTheme).supportButtonText}>
              {t('chat_with_person_button', 'Chat with support')}
            </TextDefault>
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).ticketSection}>
          <View style={styles(currentTheme).ticketSectionHeader}>
            <TextDefault textColor={currentTheme.fontMainColor} bold H4>
              {t('your_customer_support_tickets_label', 'Your Customer Support Tickets')}
            </TextDefault>
            {isLoggedIn && ticketsLoading ? <ActivityIndicator size='small' color={currentTheme.primary} /> : null}
          </View>

          {!isLoggedIn ? (
            <View style={styles(currentTheme).emptyTicketState}>
              <TextDefault textColor={currentTheme.secondaryText} center>
                {t('loginRequired', 'Please login to view your support chats.')}
              </TextDefault>
            </View>
          ) : ticketsLoading ? (
            <View style={styles(currentTheme).emptyTicketState}>
              <ActivityIndicator size='small' color={currentTheme.primary} />
            </View>
          ) : sortedTickets.length > 0 ? (
            sortedTickets.map((ticket) => {
              const isClosed = ticket?.status === 'closed'
              const isInProgress = ticket?.status === 'inProgress'
              return (
                <TouchableOpacity
                  key={ticket._id}
                  activeOpacity={0.85}
                  onPress={() => openChatForTicket(ticket)}
                  style={styles(currentTheme).ticketCard}
                >
                  <View style={styles(currentTheme).ticketTopRow}>
                    <TextDefault textColor={currentTheme.fontFourthColor} bold H5 numberOfLines={1} style={styles(currentTheme).ticketTitle}>
                      {ticket.title}
                    </TextDefault>
                    <View
                      style={[
                        styles(currentTheme).statusBadge,
                        {
                          backgroundColor: isClosed
                            ? currentTheme.gray200
                            : isInProgress
                              ? currentTheme.lightBlue
                              : currentTheme.primary
                        }
                      ]}
                    >
                      <TextDefault
                        small
                        bold
                        textColor={isClosed ? currentTheme.gray700 : currentTheme.color4}
                      >
                        {isInProgress ? t('in_progress_status_label', 'In Progress') : ticket.status}
                      </TextDefault>
                    </View>
                  </View>
                  <TextDefault textColor={currentTheme.secondaryText} small numberOfLines={2} style={styles(currentTheme).ticketDescription}>
                    {ticket.description}
                  </TextDefault>
                  <View style={styles(currentTheme).ticketMetaRow}>
                    <TextDefault textColor={currentTheme.gray500} smaller>
                      {t('created_label', 'Created')} {formatDate(ticket.createdAt)}
                    </TextDefault>
                    <MaterialIcons name='chevron-right' size={22} color={currentTheme.gray500} />
                  </View>
                </TouchableOpacity>
              )
            })
          ) : (
            <View style={styles(currentTheme).emptyTicketState}>
              <MaterialIcons name='support-agent' size={38} color={currentTheme.primary} />
              <TextDefault textColor={currentTheme.fontMainColor} bold H5 style={styles(currentTheme).emptyTicketTitle}>
                {t('no_tickets_found_label', 'No support tickets yet')}
              </TextDefault>
              <TextDefault textColor={currentTheme.secondaryText} center small style={styles(currentTheme).emptyTicketDescription}>
                {t(
                  'no_support_tickets_yet_message',
                  'Start a chat with support and your conversation will appear here.'
                )}
              </TextDefault>
            </View>
          )}
        </View>
      </ScrollView>

      <SupportTicketModal
        visible={isTicketModalVisible}
        currentTheme={currentTheme}
        onClose={() => setIsTicketModalVisible(false)}
        onCreated={handleTicketCreated}
        onOpenExistingTicket={(ticket) => {
          if (!ticket) return
          setSelectedTicket(ticket)
          setIsChatModalVisible(true)
        }}
        existingOpenTicket={activeSupportTicket}
        userName={profile?.name}
        userEmail={profile?.email}
      />

      <SupportChatModal
        visible={isChatModalVisible}
        currentTheme={currentTheme}
        ticket={selectedTicket}
        onClose={() => {
          setIsChatModalVisible(false)
          refetchTickets?.()
        }}
      />
    </SafeAreaView>
  )
}

export default CustomerSupport
