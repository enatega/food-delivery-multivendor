import React, { useState, useContext } from 'react'
import { SafeAreaView, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import StarIcon from '../../../assets/SVG/imageComponents/starIcon'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './styles'

const FeedBack = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')

  const handleStarPress = (index) => {
    setRating(index)
  }

  const handleSubmit = () => {
    if (rating > 0 && feedbackText.trim().length > 0) {
      // TODO: Implement feedback submission logic
      console.log('Feedback submitted:', { rating, feedbackText })
      // Show success message and navigate back
      navigation.goBack()
    }
  }

  const isSubmitEnabled = rating > 0 && feedbackText.trim().length > 0

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
              {t('How do you rate our products?')}
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
              {t('Your feedback helps us serve you better.')}
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default FeedBack
