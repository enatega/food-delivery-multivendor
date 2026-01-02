import { View, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Button from '../../components/Button/Button'
import { scale, verticalScale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'

const SectionListError = ({ 
  title = 'Limited time deals', 
  errorMessage = "Oops! We couldn't load the data. Tap 'Retry' to try again.",
  onRetry = null 
}) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <View style={styles(currentTheme).container}>
      <SectionHeader title={title} showSeeAll={false} />
      <View style={styles(currentTheme).errorContainer}>
        <MaterialIcons 
          name="error-outline" 
          size={48} 
          color={currentTheme.textErrorColor} 
        />
        <TextDefault style={styles(currentTheme).errorText}>
          {errorMessage}
        </TextDefault>
        {onRetry && (
          <Button
            text="Retry"
            buttonStyles={styles(currentTheme).retryButton}
            textStyles={styles(currentTheme).retryButtonText}
            buttonProps={{ onPress: onRetry }}
          />
        )}
      </View>
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      ...alignment.MTlarge,
      ...alignment.MBsmall
    },
    errorContainer: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      paddingVertical: verticalScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.errorInputBack,
      borderRadius: scale(12),
      ...alignment.MLlarge,
      ...alignment.MRlarge,
      ...alignment.MTsmall,
      borderWidth: 1,
      borderColor: currentTheme.errorInputBorder
    },
    errorText: {
      marginTop: scale(16),
      ...textStyles.H5,
      color: currentTheme.textErrorColor,
      ...textStyles.Center,
      ...alignment.MBlarge
    },
    retryButton: {
      backgroundColor: currentTheme.textErrorColor,
      paddingHorizontal: scale(24),
      paddingVertical: scale(12),
      borderRadius: scale(8),
      ...alignment.MTxSmall
    },
    retryButtonText: {
      color: currentTheme.white,
      ...textStyles.H5,
      fontWeight: '600'
    }
  })

export default SectionListError

