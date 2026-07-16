import React, { useEffect, useState } from 'react'
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useMutation } from '@apollo/client'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { scale } from '../../utils/scaling'
import TextDefault from '../Text/TextDefault/TextDefault'
import { createSupportTicket } from '../../apollo/mutations'

const SupportTicketModal = ({ visible, currentTheme, onClose, onCreated, userName, userEmail }) => {
  const [reason, setReason] = useState('order related')
  const [orderId, setOrderId] = useState('')
  const [ticketTitle, setTicketTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [submitTicket] = useMutation(createSupportTicket, {
    onCompleted: (data) => {
      setIsSubmitting(false)
      FlashMessage({ message: 'Support ticket created successfully' })
      onCreated?.(data?.createSupportTicket)
      onClose?.()
      setReason('order related')
      setOrderId('')
      setTicketTitle('')
      setDescription('')
    },
    onError: (error) => {
      setIsSubmitting(false)
      FlashMessage({
        message: error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to create support ticket',
        duration: 3000
      })
    }
  })

  useEffect(() => {
    if (!visible) return
    setReason('order related')
    setOrderId('')
    setTicketTitle('')
    setDescription('')
    setIsSubmitting(false)
  }, [visible])

  const handleSubmit = () => {
    if (isSubmitting) return

    if (!reason) {
      FlashMessage({ message: 'Please select a reason for your inquiry' })
      return
    }

    if (reason === 'order related' && !orderId.trim()) {
      FlashMessage({ message: 'Please provide your order ID' })
      return
    }

    if (reason === 'others' && !ticketTitle.trim()) {
      FlashMessage({ message: 'Please add a title for your inquiry' })
      return
    }

    if (!description.trim()) {
      FlashMessage({ message: 'Please describe the issue' })
      return
    }

    setIsSubmitting(true)

    const finalTicketTitle = reason === 'order related' ? `Order Issue - ${orderId.trim()}` : ticketTitle.trim()
    const ticketDescription =
      reason === 'order related'
        ? `Order ID: ${orderId.trim()}\n\n${description.trim()}`
        : description.trim()

    const ticketInput = {
      title: finalTicketTitle,
      description: ticketDescription,
      category: reason,
      userType: 'User'
    }

    if (reason === 'order related') {
      ticketInput.orderId = orderId.trim()
    } else {
      ticketInput.otherDetails = ticketTitle.trim()
    }

    submitTicket({
      variables: {
        ticketInput
      }
    })
  }

  return (
    <Modal animationType='slide' transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={[styles.sheet, { backgroundColor: currentTheme.cardBackground }]}>
          <View style={[styles.header, { backgroundColor: currentTheme.newheaderBG }]}>
            <View style={styles.headerCopy}>
              <TextDefault H4 bold textColor={currentTheme.newFontcolor}>
                Contact Support
              </TextDefault>
              <TextDefault small textColor={currentTheme.gray500} style={{ marginTop: scale(2) }}>
                Tell us what happened and our support team will reply here.
              </TextDefault>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name='close' size={22} color={currentTheme.newIconColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.greetingBox}>
              <TextDefault H5 bold textColor={currentTheme.newFontcolor}>
                {`Hi ${userName || 'there'}`}
              </TextDefault>
              <TextDefault small textColor={currentTheme.gray600} style={{ marginTop: scale(4) }}>
                {userEmail ? `We’ll reply to ${userEmail}` : 'We’ll reply to your registered account'}
              </TextDefault>
            </View>

            <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.sectionLabel}>
              What is your issue about?
            </TextDefault>
            <View style={styles.reasonRow}>
              {[
                { key: 'order related', label: 'Order related' },
                { key: 'others', label: 'Others' }
              ].map((item) => {
                const selected = reason === item.key
                return (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.8}
                    onPress={() => {
                      setReason(item.key)
                      if (item.key !== 'order related') {
                        setOrderId('')
                      }
                    }}
                    style={[
                      styles.reasonChip,
                      {
                        backgroundColor: selected ? currentTheme.primary : currentTheme.gray200
                      }
                    ]}
                  >
                    <TextDefault
                      small
                      bold
                      textColor={selected ? currentTheme.color4 : currentTheme.gray700}
                    >
                      {item.label}
                    </TextDefault>
                  </TouchableOpacity>
                )
              })}
            </View>

            {reason === 'order related' ? (
              <View style={styles.fieldBlock}>
                <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.fieldLabel}>
                  Order ID
                </TextDefault>
                <TextInput
                  value={orderId}
                  onChangeText={setOrderId}
                  placeholder='Enter your order ID'
                  placeholderTextColor={currentTheme.gray500}
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.gray100,
                      color: currentTheme.newFontcolor,
                      borderColor: currentTheme.borderLight
                    }
                  ]}
                />
              </View>
            ) : (
              <View style={styles.fieldBlock}>
                <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.fieldLabel}>
                  Title
                </TextDefault>
                <TextInput
                  value={ticketTitle}
                  onChangeText={setTicketTitle}
                  placeholder='Enter a short title'
                  placeholderTextColor={currentTheme.gray500}
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.gray100,
                      color: currentTheme.newFontcolor,
                      borderColor: currentTheme.borderLight
                    }
                  ]}
                />
              </View>
            )}

            <View style={styles.fieldBlock}>
              <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.fieldLabel}>
                Describe the issue
              </TextDefault>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder='Add a few details so we can help faster'
                placeholderTextColor={currentTheme.gray500}
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: currentTheme.gray100,
                    color: currentTheme.newFontcolor,
                    borderColor: currentTheme.borderLight
                  }
                ]}
                multiline
                textAlignVertical='top'
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: currentTheme.borderLight, backgroundColor: currentTheme.cardBackground }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={
                !reason ||
                (reason === 'order related' && !orderId.trim()) ||
                (reason === 'others' && !ticketTitle.trim()) ||
                !description.trim() ||
                isSubmitting
              }
              style={[
                styles.submitButton,
                {
                  backgroundColor: currentTheme.primary,
                  opacity:
                    !reason ||
                    (reason === 'order related' && !orderId.trim()) ||
                    (reason === 'others' && !ticketTitle.trim()) ||
                    !description.trim() ||
                    isSubmitting
                      ? 0.65
                      : 1
                }
              ]}
            >
              <TextDefault bold textColor={currentTheme.color4}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: scale(22),
    borderTopRightRadius: scale(22),
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(14)
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
  body: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    paddingBottom: scale(24)
  },
  greetingBox: {
    marginBottom: scale(14)
  },
  sectionLabel: {
    marginBottom: scale(10)
  },
  reasonRow: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: scale(16)
  },
  reasonChip: {
    flex: 1,
    minHeight: scale(42),
    borderRadius: scale(21),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(12)
  },
  fieldBlock: {
    marginBottom: scale(14)
  },
  fieldLabel: {
    marginBottom: scale(8)
  },
  input: {
    minHeight: scale(46),
    borderRadius: scale(14),
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    fontSize: scale(12)
  },
  textArea: {
    minHeight: scale(120)
  },
  footer: {
    padding: scale(16),
    borderTopWidth: StyleSheet.hairlineWidth
  },
  submitButton: {
    height: scale(46),
    borderRadius: scale(23),
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default React.memo(SupportTicketModal)
