import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Alert, TextInput } from 'react-native'
import styles from './styles'
import Modal from 'react-native-modal'
import { changePassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import {useTranslation} from 'react-i18next'
import { Feather } from '@expo/vector-icons'


const CHANGE_PASSWORD = gql`
  ${changePassword}
`

function ChangePassword(props) {

  const {t} = useTranslation()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [oldPasswordError, setOldPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const [mutate, { loading }] = useMutation(CHANGE_PASSWORD, {
    onError,
    onCompleted
  })

  function onError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }
  function clearFields() {
    setOldPassword('')
    setNewPassword('')
    setOldPasswordError('')
    setNewPasswordError('')
  }

  function onCompleted(data) {
    if (data.changePassword) {
      clearFields()
      FlashMessage({
        message: t('updatePassword')
      })
      props.hideModal()
    } else {
      Alert.alert('Error', t('invalidPassword'))
    }
  }

  return (
    <Modal
      onBackButtonPress={props.hideModal}
      onBackdropPress={props.hideModal}
      isVisible={props.modalVisible}
      animationType='slide'
      onModalHide={clearFields}
    >
      <View style={styles(currentTheme).modalContainer}>
        <View style={styles().modalHeader}>
          <View activeOpacity={0.7} style={styles().modalheading}>
            <TextDefault H4 bolder textColor={currentTheme.newFontcolor} center>
              {t('changePassword')}
            </TextDefault>
          </View>
          <Feather
            name='x-circle'
            size={24}
            color={currentTheme.newIconColor}
            onPress={() => props.hideModal()}
          />
        </View>

        <View style={{ ...alignment.MTsmall, gap: 8 }}>
          <TextDefault uppercase bold textColor={currentTheme.gray500}>
            {t('currentPassword')}
          </TextDefault>
          <TextInput
            style={[
              styles(currentTheme).modalInput,
              {
                borderBottomColor: oldPasswordError
                  ? currentTheme.textErrorColor
                  : currentTheme.tagColor,
                borderBottomWidth: 1
              }
            ]}
            maxLength={20}
            secureTextEntry
            value={oldPassword}
            onChangeText={(text) => {
              setOldPassword(text)
              setOldPasswordError(text ? '' : t('passErr1'))
            }}
            onBlur={() => {
              setOldPasswordError(!oldPassword ? t('passErr1') : '')
            }}
          />
          {oldPasswordError ? (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {oldPasswordError}
            </TextDefault>
          ) : null}
        </View>

        <View style={{ ...alignment.MTmedium, gap: 8 }}>
          <TextDefault uppercase bold textColor={currentTheme.gray500}>
            {t('newPassword')}
          </TextDefault>
          <TextInput
            style={[
              styles(currentTheme).modalInput,
              {
                borderBottomColor: newPasswordError
                  ? currentTheme.textErrorColor
                  : currentTheme.tagColor,
                borderBottomWidth: 1
              }
            ]}
            maxLength={20}
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text)
              setNewPasswordError(text ? '' : t('passErr1'))
            }}
            onBlur={() => {
              setNewPasswordError(!newPassword ? t('passErr1') : '')
            }}
          />
          {newPasswordError ? (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {newPasswordError}
            </TextDefault>
          ) : null}
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            if (newPassword === '' || oldPassword === '') {
              props.hideModal()
            }
            const newPasswordError = newPassword === '' ? t('passErr1') : ''
            const oldPasswordError = oldPassword === '' ? t('passErr1') : ''
            setNewPasswordError(newPasswordError)
            setOldPasswordError(oldPasswordError)

            if (
              oldPasswordError.length === 0 &&
              newPasswordError.length === 0
            ) {
              mutate({ variables: { oldPassword, newPassword } })
            }
          }}
          style={[styles(currentTheme).btnContainer]}
        >
          <TextDefault
            textColor={currentTheme.newFontcolor}
            style={styles().checkoutBtn}
            bold
            H4
          >
            {newPassword !== '' && oldPassword !== ''
              ? t('apply')
              : t('Cancel')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ChangePassword
