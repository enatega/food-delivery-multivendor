import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { useMutation, useQuery } from '@apollo/client'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { scale } from '../../utils/scaling'
import TextDefault from '../Text/TextDefault/TextDefault'
import {
  GET_SINGLE_SUPPORT_TICKET,
  GET_TICKET_MESSAGES
} from '../../apollo/queries'
import { createTicketMessage } from '../../apollo/mutations'

const SupportChatModal = ({ visible, currentTheme, ticket, onClose }) => {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [allowBackdropClose, setAllowBackdropClose] = useState(false)
  const [footerHeight, setFooterHeight] = useState(scale(82))
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const scrollRef = useRef(null)
  const insets = useSafeAreaInsets()

  const ticketId = ticket?._id

  const {
    data: ticketDetailsData,
    loading: ticketLoading,
    refetch: refetchTicket
  } = useQuery(GET_SINGLE_SUPPORT_TICKET, {
    variables: { ticketId },
    skip: !visible || !ticketId,
    fetchPolicy: 'network-only'
  })

  const {
    data,
    loading: messagesLoading,
    refetch: refetchMessages
  } = useQuery(GET_TICKET_MESSAGES, {
    variables: {
      input: {
        ticket: ticketId,
        page: 1,
        limit: 50
      }
    },
    skip: !visible || !ticketId,
    fetchPolicy: 'network-only',
    pollInterval: visible ? 3000 : 0,
    onError: (error) => {
      FlashMessage({
        message: error?.message || 'Failed to load messages',
        duration: 3000
      })
    }
  })

  const [sendMessage] = useMutation(createTicketMessage, {
    onCompleted: () => {
      setMessage('')
      setIsSending(false)
      refetchMessages()
    },
    onError: (error) => {
      setIsSending(false)
      FlashMessage({
        message: error?.message || 'Failed to send message',
        duration: 3000
      })
    }
  })

  useEffect(() => {
    if (!visible || !ticketId) return
    refetchTicket?.()
    refetchMessages?.()
  }, [visible, ticketId, refetchMessages, refetchTicket])

  useEffect(() => {
    if (!visible) {
      setMessage('')
      setIsSending(false)
      setAllowBackdropClose(false)
      return
    }

    setAllowBackdropClose(false)
    const timer = setTimeout(() => {
      setAllowBackdropClose(true)
    }, 250)

    return () => clearTimeout(timer)
  }, [visible])

  useEffect(() => {
    if (!visible) return
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true })
    })
  }, [visible, data?.getTicketMessages?.messages?.length, message])

  useEffect(() => {
    if (!visible) return

    const scrollToLatest = () => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd?.({ animated: true })
      })
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event?.endCoordinates?.height || 0)
      scrollToLatest()
    })
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
      scrollToLatest()
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [visible])

  const ticketData = ticketDetailsData?.getSingleSupportTicket || ticket
  const ticketDescription = ticketData?.description?.trim()
  const supportBubbleColor =
    currentTheme.themeBackground === '#000' ? '#1F2937' : currentTheme.gray100
  const supportTextColor =
    currentTheme.themeBackground === '#000'
      ? currentTheme.fontFourthColor
      : currentTheme.gray700

  const orderedMessages = (data?.getTicketMessages?.messages || [])
    .filter((msg) => msg?.content?.trim() !== ticketDescription)
    .slice()
    .reverse()
  const isClosed = ['closed', 'Closed'].includes(ticketData?.status)

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(Number(timestamp))
      return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString()}`
    } catch (error) {
      return ''
    }
  }

  const handleSend = () => {
    if (!message.trim() || isSending || !ticketId) return
    setIsSending(true)
    sendMessage({
      variables: {
        messageInput: {
          content: message.trim(),
          ticket: ticketId
        }
      }
    })
  }

  if (!visible) return null

  return (
    <Modal
      animationType='slide'
      transparent
      visible={visible}
      statusBarTranslucent
      presentationStyle='overFullScreen'
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={allowBackdropClose ? onClose : undefined}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? scale(12) : 0}
          style={styles.sheetWrap}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: currentTheme.cardBackground,
                paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0
              }
            ]}
          >
            <View style={[styles.header, { backgroundColor: currentTheme.newheaderBG }]}>
            <View style={styles.headerCopy}>
              <TextDefault H4 bold textColor={currentTheme.newFontcolor} numberOfLines={1}>
                {ticketData?.title || 'Support Chat'}
              </TextDefault>
              <TextDefault small textColor={currentTheme.gray500} style={{ marginTop: scale(2) }}>
                {ticketData?.status === 'inProgress'
                  ? 'In Progress'
                  : ticketData?.status
                  ? ticketData.status.charAt(0).toUpperCase() + ticketData.status.slice(1)
                  : 'Open'}
              </TextDefault>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name='close' size={22} color={currentTheme.newIconColor} />
            </TouchableOpacity>
          </View>

            {ticketData?.description ? (
              <View
                style={[
                  styles.ticketMeta,
                  {
                    backgroundColor: currentTheme.gray100,
                    borderBottomColor: currentTheme.borderLight
                  }
                ]}
              >
                <TextDefault small bold textColor={currentTheme.gray700}>
                  Ticket Description
                </TextDefault>
                <TextDefault small textColor={currentTheme.gray600} style={{ marginTop: scale(4) }}>
                  {ticketData.description}
                </TextDefault>
                <TextDefault small textColor={currentTheme.gray500} style={{ marginTop: scale(6) }}>
                  {formatTimestamp(ticketData.createdAt)}
                </TextDefault>
              </View>
            ) : null}

            <View style={styles.messagesWrap}>
              {ticketLoading || messagesLoading ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size='large' color={currentTheme.primary} />
                </View>
              ) : orderedMessages.length > 0 ? (
                <ScrollView
                  ref={scrollRef}
                  style={styles.messagesScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.messagesContent,
                    {
                      paddingBottom:
                        footerHeight +
                        scale(12) +
                        insets.bottom
                    }
                  ]}
                  keyboardShouldPersistTaps='handled'
                  keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                  nestedScrollEnabled
                  onContentSizeChange={() => {
                    scrollRef.current?.scrollToEnd?.({ animated: true })
                  }}
                >
                  {orderedMessages.map((msg) => {
                    const senderType = String(msg.senderType || '').toLowerCase()
                    const isUserMessage = senderType === 'user'
                    const isSupportMessage = senderType === 'admin'
                    const bubbleStyle = isUserMessage
                      ? {
                          alignSelf: 'flex-end',
                          backgroundColor: currentTheme.primary
                        }
                      : {
                          alignSelf: 'flex-start',
                          backgroundColor: isSupportMessage
                            ? supportBubbleColor
                            : currentTheme.gray100
                        }
                    return (
                      <View key={msg._id} style={[styles.messageBubble, bubbleStyle]}>
                        <TextDefault
                          small
                          textColor={isUserMessage ? currentTheme.color4 : supportTextColor}
                        >
                          {msg.content}
                        </TextDefault>
                        <TextDefault
                          smaller
                          textColor={isUserMessage ? currentTheme.color4 : currentTheme.gray500}
                          style={styles.messageTime}
                        >
                          {formatTimestamp(msg.createdAt)}
                        </TextDefault>
                      </View>
                    )
                  })}
                </ScrollView>
              ) : (
                <View style={styles.emptyWrap}>
                  <MaterialIcons name='chat-bubble-outline' size={42} color={currentTheme.primary} />
                  <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={{ marginTop: scale(10) }}>
                    No messages yet
                  </TextDefault>
                  <TextDefault small textColor={currentTheme.gray500} style={{ marginTop: scale(4), textAlign: 'center' }}>
                    Send the first message and our support team will reply here.
                  </TextDefault>
                </View>
              )}
            </View>

            <View
              onLayout={(event) => {
                const nextFooterHeight = event?.nativeEvent?.layout?.height
                if (nextFooterHeight) {
                  setFooterHeight(nextFooterHeight)
                }
              }}
              style={[
                styles.footer,
                {
                  borderTopColor: currentTheme.borderLight,
                  backgroundColor: currentTheme.cardBackground,
                  paddingBottom: scale(12) + insets.bottom
                }
              ]}
            >
            {isClosed ? (
              <View style={styles.closedState}>
                <TextDefault small textColor={currentTheme.gray500} center>
                  This ticket is closed. You cannot send new messages.
                </TextDefault>
              </View>
            ) : (
              <View style={styles.inputRow}>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder='Type your message here...'
                  placeholderTextColor={currentTheme.gray500}
                  multiline
                  scrollEnabled
                  textAlignVertical='top'
                  onFocus={() => {
                    requestAnimationFrame(() => {
                      scrollRef.current?.scrollToEnd?.({ animated: true })
                    })
                  }}
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.gray100,
                      color: currentTheme.newFontcolor,
                      borderColor: currentTheme.borderLight
                    }
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSend}
                  disabled={!message.trim() || isSending}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor: currentTheme.primary,
                      opacity: !message.trim() || isSending ? 0.6 : 1
                    }
                  ]}
                >
                  {isSending ? (
                    <ActivityIndicator size='small' color={currentTheme.color4} />
                  ) : (
                    <MaterialIcons name='send' size={20} color={currentTheme.color4} />
                  )}
                </TouchableOpacity>
              </View>
            )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  modalRoot: {
    flex: 1
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  sheet: {
    height: '92%',
    width: '100%',
    borderTopLeftRadius: scale(22),
    borderTopRightRadius: scale(22),
    alignSelf: 'stretch',
    position: 'relative',
    zIndex: 2,
    elevation: 12,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    minHeight: scale(68)
  },
  headerCopy: {
    flex: 1,
    paddingRight: scale(12)
  },
  closeButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center'
  },
  ticketMeta: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  messagesWrap: {
    flex: 1,
    minHeight: scale(220)
  },
  messagesScroll: {
    flex: 1
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(220)
  },
  messagesContent: {
    padding: scale(16),
    paddingBottom: scale(24),
    flexGrow: 1
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: scale(16),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    marginBottom: scale(10)
  },
  messageTime: {
    marginTop: scale(4),
    textAlign: 'right'
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(220),
    paddingHorizontal: scale(18)
  },
  footer: {
    padding: scale(12),
    borderTopWidth: StyleSheet.hairlineWidth
  },
  closedState: {
    paddingVertical: scale(10)
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: scale(10)
  },
  input: {
    flex: 1,
    minHeight: scale(46),
    maxHeight: scale(110),
    borderRadius: scale(16),
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    fontSize: scale(12)
  },
  sendButton: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default React.memo(SupportChatModal)
