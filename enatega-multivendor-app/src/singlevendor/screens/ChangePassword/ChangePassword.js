import React, { useContext, useState } from 'react'
import { SafeAreaView, ScrollView, View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useMutation, gql } from '@apollo/client'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { CHANGE_PASSWORD } from '../../apollo/mutations'
import {
  ChangePasswordHeader,
  PasswordInput,
  UpdateButton
} from '../../components/ChangePassword'

import styles from './styles'

const ChangePassword = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data?.changePassword) {
        Alert.alert(t('success'), t('updatePassword'), [
          { text: t('ok'), onPress: () => navigation.goBack() }
        ])
      } else {
        Alert.alert(t('error'), t('incorrectPassword'))
      }
    },
    onError: (error) => {
      Alert.alert(t('error'), error.message)
    }
  })

  const isFormValid = () => {
    return (
      currentPassword.length > 0 &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword
    )
  }

  const handleUpdate = () => {
    if (!isFormValid()) {
      if (newPassword !== confirmPassword) {
        Alert.alert(t('error'), t('passwordMismatch'))
        return
      }
      if (newPassword.length < 6) {
        Alert.alert(t('error'), t('passwordTooShort'))
        return
      }
      return
    }

    changePassword({
      variables: {
        oldPassword: currentPassword,
        newPassword: newPassword
      }
    })
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <ChangePasswordHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles(currentTheme).formContainer}>
          <PasswordInput
            label={t('currentPassword')}
            placeholder={t('enterCurrentPassword')}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            currentTheme={currentTheme}
          />

          <PasswordInput
            label={t('newPassword')}
            placeholder={t('enterNewPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            currentTheme={currentTheme}
          />

          <PasswordInput
            label={t('confirmNewPassword')}
            placeholder={t('enterConfirmNewPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            currentTheme={currentTheme}
          />
        </View>
      </ScrollView>

      <View style={styles(currentTheme).buttonContainer}>
        <UpdateButton
          onPress={handleUpdate}
          disabled={!isFormValid() || loading}
          loading={loading}
          currentTheme={currentTheme}
        />
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword
