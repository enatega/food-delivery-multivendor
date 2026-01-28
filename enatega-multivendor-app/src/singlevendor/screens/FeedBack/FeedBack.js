import React, { useState, useContext } from 'react'
import { SafeAreaView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import StarIcon from '../../../assets/SVG/imageComponents/starIcon'
import { scale, verticalScale } from '../../../utils/scaling'
import { reviewOrder } from '../../../apollo/mutations'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import Spinner from '../../../components/Spinner/Spinner'
import styles from './styles'
import { REVIEW_ORDER_SINGLE_VENDOR } from '../../apollo/mutations'

const REVIEWORDER = gql`
  ${REVIEW_ORDER_SINGLE_VENDOR}
`

const FeedBack = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const isDelivered = route?.params?.isDelivered || false
  const orderId = route?.params?.orderId || null

  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  console.log('rating_data',rating);
  

  const [mutate, { loading: submittingReview }] = useMutation(REVIEWORDER, {
    onCompleted: (data) => {
      FlashMessage({ message: t('Feedback submitted successfully') || 'Feedback submitted successfully' })
      navigation.goBack()
    },
    onError: (error) => {
      console.log('Review error:', JSON.stringify(error))
      FlashMessage({
        message: error?.networkError?.result?.errors?.[0]?.message || error?.message || t('Something went wrong, please try again!') || 'Something went wrong, please try again!'
      })
    }
  })

  const handleStarPress = (index) => {
    setRating(index)
  }

  const handleSubmit = () => {
    if (rating > 0 && feedbackText.trim().length > 0 && orderId) {
      mutate({
        variables: {
          reviewInput: {
            order: orderId,
            rating: rating,
            description: feedbackText.trim()
          }
        }
      })
    } else if (!orderId) {
      FlashMessage({ message: t('Order ID is missing') || 'Order ID is missing' })
    } else if (rating === 0) {
      FlashMessage({ message: t('Please add star rating first') || 'Please add star rating first' })
    } else {
      FlashMessage({ message: t('Please write your feedback') || 'Please write your feedback' })
    }
  }

  const isSubmitEnabled = rating > 0 && feedbackText.trim().length > 0 && !submittingReview

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <AccountSectionHeader 
        currentTheme={currentTheme} 
        onBack={() => navigation.goBack()} 
        headerText={t('Feedback') || 'Feedback'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles(currentTheme).keyboardView}
      >
        <ScrollView
          style={styles(currentTheme).scrollView}
          contentContainerStyle={styles(currentTheme).scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(currentTheme).content}>
            <TextDefault 
              textColor={currentTheme.fontMainColor} 
              style={styles(currentTheme).questionText}
              bolder
            >
              {isDelivered ? t('How was your delivery?') : t('How do you rate our products?')}
            </TextDefault>

            <View style={styles(currentTheme).starsContainer}>
              {[1, 2, 3, 4, 5].map((index) => (
                <View key={`star-wrapper-${index}`} style={styles(currentTheme).starWrapper}>
                  <StarIcon
                    isFilled={index <= rating}
                    onPress={() => handleStarPress(index)}
                  />
                </View>
              ))}
            </View>

            <TextDefault 
              textColor={currentTheme.fontSecondColor} 
              style={styles(currentTheme).helperText}
            >
              {isDelivered ? t('Your feedback helps us improve our delivery.') : t('Your feedback helps us serve you better.')}
            </TextDefault>

            <View style={styles(currentTheme).inputContainer}>
              <TextInput
                style={styles(currentTheme).textInput}
                placeholder={t('Write your experience here...')}
                placeholderTextColor={currentTheme.fontSecondColor}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles(currentTheme).buttonContainer}>
          {submittingReview ? (
            <Spinner />
          ) : (
            <TouchableOpacity
              style={[
                styles(currentTheme).submitButton,
                !isSubmitEnabled && styles(currentTheme).submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isSubmitEnabled}
              activeOpacity={0.7}
            >
              <TextDefault
                textColor={isSubmitEnabled ? currentTheme.fontWhite : currentTheme.fontSecondColor}
                style={styles(currentTheme).submitButtonText}
                bolder
              >
                {t('Submit') }
              </TextDefault>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default FeedBack
