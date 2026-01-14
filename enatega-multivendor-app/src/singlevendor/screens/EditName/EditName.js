import React, { useContext, useState } from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform
} from 'react-native'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import UserContext from '../../../context/User'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { updateUser } from '../../../apollo/mutations'
import { ScreenHeader } from '../../components/Common'

import styles from './styles'

const UPDATEUSER = gql`
  ${updateUser}
`

const EditName = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { t, i18n } = useTranslation()
  const { profile, refetchProfile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const initialName = route?.params?.name || profile?.name || ''

  const [name, setName] = useState(initialName)
  const [nameError, setNameError] = useState('')

  const [mutate, { loading: loadingMutation }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError,
    refetchQueries: ['Profile'],
    awaitRefetchQueries: true
  })

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  function onCompleted({ updateUser }) {
    if (updateUser) {
      FlashMessage({
        message: t('userInfoUpdated')
      })
      refetchProfile()
      navigation.goBack()
    }
  }

  function onError(error) {
    try {
      if (error.graphQLErrors) {
        FlashMessage({
          message: error.graphQLErrors[0].message
        })
      } else if (error.networkError) {
        FlashMessage({
          message: error.networkError.result.errors[0].message
        })
      }
    } catch (err) {
      FlashMessage({
        message: t('errorOccurred')
      })
    }
  }

  const validateName = () => {
    setNameError('')

    const trimmedName = name.trim()

    if (!trimmedName) {
      setNameError(t('Name is required'))
      return false
    }

    return true
  }

  const handleUpdate = async () => {
    if (!validateName()) {
      return
    }

    const trimmedName = name.trim()
    
    try {
      await mutate({
        variables: {
          name: trimmedName
        }
      })
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const isChanged = name.trim() !== initialName

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      {/* Header */}
      <ScreenHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        title={t('Full name')}
        subtitle={t('edit_name_subtitle')}
      />

      {/* Content */}
      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles(currentTheme).contentContainer}>
          {/* Full Name Input */}
          <View style={styles(currentTheme).inputContainer}>
            <TextDefault
              H5
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).inputLabel}
              bold
            >
              {t('Full name')}
            </TextDefault>
            <TextInput
              style={styles(currentTheme).textInput}
              placeholderTextColor={currentTheme.fontSecondColor}
              placeholder={t('Enter your full name')}
              value={name}
              onChangeText={(text) => {
                setName(text)
                setNameError('')
              }}
            />
            {nameError !== '' && (
              <TextDefault
                style={styles(currentTheme).errorText}
                textColor={currentTheme.red600}
              >
                {nameError}
              </TextDefault>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Update Button */}
      <View style={styles(currentTheme).footer}>
        <TouchableOpacity
          style={[
            styles(currentTheme).updateButton,
            (!isChanged || loadingMutation) && styles(currentTheme).updateButtonDisabled
          ]}
          onPress={handleUpdate}
          disabled={!isChanged || loadingMutation}
          activeOpacity={0.7}
        >
          {loadingMutation ? (
            <Spinner 
              size="small" 
              backColor="transparent" 
              spinnerColor={!isChanged || loadingMutation ? currentTheme.fontMainColor : '#FFFFFF'} 
            />
          ) : (
            <TextDefault
              H4
              bolder
              textColor={!isChanged || loadingMutation ? currentTheme.fontSecondColor : '#FFFFFF'}
            >
              {t('Update')}
            </TextDefault>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default EditName
