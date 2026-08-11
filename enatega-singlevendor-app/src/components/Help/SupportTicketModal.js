import React, { useEffect, useMemo, useState } from 'react'
import { Modal, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { scale } from '../../utils/scaling'
import TextDefault from '../Text/TextDefault/TextDefault'
import { createSupportTicket } from '../../apollo/mutations'

const SupportTicketModal = ({ visible, currentTheme, onClose, onCreated, onOpenExistingTicket, existingOpenTicket, userName, userEmail }) => {
  const { t } = useTranslation()
  const [reason, setReason] = useState('order related')
  const [orderId, setOrderId] = useState('')
  const [ticketTitle, setTicketTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inlineNotice, setInlineNotice] = useState('')

  const isExistingOpenTicket = useMemo(() => ['open', 'inProgress'].includes(existingOpenTicket?.status), [existingOpenTicket])

  const friendlyDuplicateMessage = `${t('support_chat_title')}: ${t('in_progress_status_label')}`

  const [submitTicket] = useMutation(createSupportTicket, {
    onCompleted: (data) => {
      setIsSubmitting(false)
      setInlineNotice('')
      FlashMessage({ message: t('support_ticket_created_successfully') })
      onCreated?.(data?.createSupportTicket)
      onClose?.()
      setReason('order related')
      setOrderId('')
      setTicketTitle('')
      setDescription('')
    },
    onError: (error) => {
      setIsSubmitting(false)
      const backendMessage = error?.graphQLErrors?.[0]?.message || error?.message || t('failed_to_create_support_ticket')
      const isDuplicateOpenTicket = /already.*open ticket|already have.*open ticket|open support chat|open ticket/i.test(backendMessage)

      if (isDuplicateOpenTicket) {
        setInlineNotice(friendlyDuplicateMessage)
        if (existingOpenTicket && isExistingOpenTicket) {
          onOpenExistingTicket?.(existingOpenTicket)
        }
        return
      }

      const translatedError = t('failed_to_create_support_ticket')
      setInlineNotice(translatedError)
      FlashMessage({
        message: translatedError,
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
    setInlineNotice('')
  }, [visible])

  const handleSubmit = () => {
    if (isSubmitting) return

    if (existingOpenTicket && isExistingOpenTicket) {
      onOpenExistingTicket?.(existingOpenTicket)
      onClose?.()
      return
    }

    if (!reason) {
      FlashMessage({ message: t('select_reason_for_inquiry') })
      return
    }

    if (reason === 'order related' && !orderId.trim()) {
      FlashMessage({ message: t('provide_order_idprovide_order_id') })
      return
    }

    if (reason === 'others' && !ticketTitle.trim()) {
      FlashMessage({ message: t('provide_title_for_inquiry') })
      return
    }

    if (!description.trim()) {
      FlashMessage({ message: t('provide_description_of_issue') })
      return
    }

    setIsSubmitting(true)

    const finalTicketTitle = reason === 'order related' ? `Order Issue - ${orderId.trim()}` : ticketTitle.trim()
    const ticketDescription = reason === 'order related' ? `Order ID: ${orderId.trim()}\n\n${description.trim()}` : description.trim()

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetWrap}>
        <View style={[styles.sheet, { backgroundColor: currentTheme.cardBackground }]}>
          <View style={[styles.header, { backgroundColor: currentTheme.newheaderBG }]}>
            <View style={styles.headerCopy}>
              <TextDefault H4 bold textColor={currentTheme.newFontcolor}>
                {t('support_modal_title')}
              </TextDefault>
              <TextDefault small textColor={currentTheme.gray500} style={{ marginTop: scale(2) }}>
                {t('support_team_available_message')}
              </TextDefault>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name='close' size={22} color={currentTheme.newIconColor} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body} keyboardShouldPersistTaps='handled'>
            {inlineNotice
              ? (
              <View
                style={[
                  styles.noticeBox,
                  {
                    backgroundColor: currentTheme.gray100,
                    borderColor: currentTheme.primary
                  }
                ]}
              >
                <TextDefault small bold textColor={currentTheme.newFontcolor}>
                  {inlineNotice}
                </TextDefault>
              </View>
                )
              : null}

            <View style={styles.greetingBox}>
              <TextDefault H5 bold textColor={currentTheme.newFontcolor}>
                {`${t('hi_label')} ${userName || ''}`}
              </TextDefault>
              <TextDefault small textColor={currentTheme.gray600} style={{ marginTop: scale(4) }}>
                {userEmail ? `${t('email_label')}: ${userEmail}` : null}
              </TextDefault>
            </View>

            <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.sectionLabel}>
              {t('whats_your_issue_about_label')}
            </TextDefault>
            <View style={styles.reasonRow}>
              {[
                { key: 'order related', label: t('order_related_label') },
                { key: 'others', label: t('others_label') }
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
                    <TextDefault small bold textColor={selected ? currentTheme.color4 : currentTheme.gray700}>
                      {item.label}
                    </TextDefault>
                  </TouchableOpacity>
                )
              })}
            </View>

            {reason === 'order related'
              ? (
              <View style={styles.fieldBlock}>
                <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.fieldLabel}>
                  {t('order_id_label')}
                </TextDefault>
                <TextInput
                  value={orderId}
                  onChangeText={setOrderId}
                  placeholder={t('enter_order_id_placeholder')}
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
                )
              : (
              <View style={styles.fieldBlock}>
                <TextDefault H5 bold textColor={currentTheme.newFontcolor} style={styles.fieldLabel}>
                  {t('title_label')}
                </TextDefault>
                <TextInput
                  value={ticketTitle}
                  onChangeText={setTicketTitle}
                  placeholder={t('enter_title_for_inquiry_placeholder')}
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
                {t('tell_us_more_about_issue_label')}
              </TextDefault>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('describe_issue_in_detail_placeholder')}
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
              disabled={!reason || (reason === 'order related' && !orderId.trim()) || (reason === 'others' && !ticketTitle.trim()) || !description.trim() || isSubmitting}
              style={[
                styles.submitButton,
                {
                  backgroundColor: currentTheme.primary,
                  opacity: !reason || (reason === 'order related' && !orderId.trim()) || (reason === 'others' && !ticketTitle.trim()) || !description.trim() || isSubmitting ? 0.65 : 1
                }
              ]}
            >
              <TextDefault bold textColor={currentTheme.color4}>
                {t('send_button')}
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
  noticeBox: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: scale(14),
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    marginBottom: scale(14)
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
