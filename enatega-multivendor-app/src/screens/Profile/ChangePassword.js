import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import styles from './styles'
import Modal from 'react-native-modal'
import { TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import { changePassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { alignment } from '../../utils/alignment'
import { OutlinedTextField } from 'react-native-material-textfield'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import {useTranslation} from 'react-i18next'


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
      isVisible={props.modalVisible}>
      <View style={styles(currentTheme).modalContainer}>
        <View style={styles(currentTheme).modalContent}>
          <View style={styles(currentTheme).titleContainer}>
            <TextDefault textColor={currentTheme.darkBgFont} B700 bolder H4>
              {t('changePassword')}
            </TextDefault>
          </View>

          <View style={{ ...alignment.MTsmall }}>
            <View style={{ ...alignment.MTsmall }}>
              <OutlinedTextField
                autoFocus={true}
                label={t('changePassword')}
                labelFontSize={scale(10)}
                fontSize={scale(12)}
                labelHeight={10}
                maxLength={20}
                secureTextEntry
                textColor={currentTheme.fontMainColor}
                baseColor={currentTheme.darkBgFont}
                errorColor={currentTheme.textErrorColor}
                tintColor={currentTheme.tagColor}
                error={oldPasswordError}
                onChangeText={setOldPassword}
                onBlur={() => {
                  setOldPasswordError(
                    !oldPassword ? t('passErr1') : ''
                  )
                }}
              />
            </View>
          </View>
          <View style={{ ...alignment.MTmedium }}>
            <View style={{ ...alignment.MTsmall }}>
              <OutlinedTextField
                autoFocus={true}
                label={t('newPassword')}
                labelFontSize={scale(10)}
                fontSize={scale(12)}
                labelHeight={10}
                maxLength={20}
                secureTextEntry
                labelTextStyle={{
                  fontSize: scale(12)
                }}
                inputContainerStyle={{
                  ...alignment.PLsmall
                }}
                textColor={currentTheme.fontMainColor}
                baseColor={currentTheme.darkBgFont}
                errorColor={currentTheme.textErrorColor}
                tintColor={currentTheme.tagColor}
                error={newPasswordError}
                onChangeText={setNewPassword}
                onBlur={() => {
                  setNewPasswordError(
                    !newPassword ? t('passErr1') : ''
                  )
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              if (newPassword === '' || oldPassword === '') {
                props.hideModal()
              }
              const newPasswordError =
                newPassword === '' ? t('passErr1') : ''
              const oldPasswordError =
                oldPassword === '' ? t('passErr1') : ''
              setNewPasswordError(newPasswordError)
              setOldPasswordError(oldPasswordError)

              if (
                oldPasswordError.length === 0 &&
                newPasswordError.length === 0
              ) {
                mutate({ variables: { oldPassword, newPassword } })
              }
            }}
            style={[styles().btnContainer]}>
            <TextDefault
              textColor={currentTheme.tagColor}
              bolder
              B800
              uppercase
              small>
              {newPassword !== '' && oldPassword !== ''
                ? t('apply')
                : t('Cancel')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ChangePassword
