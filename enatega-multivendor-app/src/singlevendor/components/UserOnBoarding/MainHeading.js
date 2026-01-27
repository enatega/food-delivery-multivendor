import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const MainHeading = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <TextDefault H2 textColor={currentTheme?.headerMainFontColor}>
      {t('Sign up now and get all your favorites delivered to your door.')}
    </TextDefault>
  )
}

export default MainHeading
