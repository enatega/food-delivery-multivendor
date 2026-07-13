import React, { useContext } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
// import useEnvVars from '../../../../environment'
import {
  LegalHeader,
  LegalContent
} from '../../components/Legal'

import styles from './styles'

const TermsOfUse = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  // const { TERMS_AND_CONDITIONS } = useEnvVars()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <LegalHeader
        title={t('temrConditions')}
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LegalContent
          type="terms"
          // url={TERMS_AND_CONDITIONS}
          currentTheme={currentTheme}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default TermsOfUse
