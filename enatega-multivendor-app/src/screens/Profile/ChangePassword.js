import React, { useState, useContext } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import styles from './styles'
import Modal from 'react-native-modal'
import { TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import i18n from '../../../i18n'
import { changePassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'

const CHANGE_PASSWORD = gql`
  ${changePassword}
`

function ChangePassword(props) {
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
        message: 'Password Updated'
      })
      props.hideModal()
    } else {
      Alert.alert('Error', 'Invalid password')
    }
  }

  return (
    <Modal
      onBackButtonPress={props.hideModal}
      onBackdropPress={props.hideModal}
      isVisible={props.modalVisible}>
      <View style={styles(currentTheme).modalContainer}>
        <View style={styles().modalContent}>
          <View style={styles().titleContainer}>
            <TextDefault textColor={currentTheme.fontMainColor} B700 bolder H5>
              Change password
            </TextDefault>
          </View>

          <View style={{ ...alignment.MTsmall }}>
            <TextField
              secureTextEntry
              autoFocus={true}
              error={oldPasswordError}
              label="Current Password"
              labelFontSize={scale(10)}
              fontSize={scale(12)}
              labelHeight={10}
              textColor={currentTheme.fontMainColor}
              baseColor={currentTheme.fontSecondColor}
              errorColor={currentTheme.textErrorColor}
              tintColor={currentTheme.tagColor}
              labelTextStyle={{
                fontSize: scale(12)
              }}
              inputContainerStyle={{
                ...alignment.PLsmall
              }}
              onChangeText={setOldPassword}
              onBlur={() => {
                setOldPasswordError(!oldPassword ? 'Password is required' : '')
              }}
            />
          </View>
          <View style={{ ...alignment.MTmedium }}>
            <TextField
              secureTextEntry
              error={newPasswordError}
              label="New Password"
              labelFontSize={scale(10)}
              fontSize={scale(12)}
              labelHeight={10}
              textColor={currentTheme.fontMainColor}
              baseColor={currentTheme.fontSecondColor}
              errorColor={currentTheme.textErrorColor}
              tintColor={currentTheme.tagColor}
              labelTextStyle={{
                fontSize: scale(12)
              }}
              inputContainerStyle={{
                ...alignment.PLsmall
              }}
              onChangeText={setNewPassword}
              onBlur={() => {
                setNewPasswordError(!newPassword ? 'Password is required' : '')
              }}
            />
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              if (newPassword === '' || oldPassword === '') {
                props.hideModal()
              }
              const newPasswordError =
                newPassword === '' ? 'Password is required' : ''
              const oldPasswordError =
                oldPassword === '' ? 'Password is required' : ''
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
              B700
              uppercase
              small>
              {newPassword !== '' && oldPassword !== ''
                ? i18n.t('apply')
                : 'Cancel'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default ChangePassword
