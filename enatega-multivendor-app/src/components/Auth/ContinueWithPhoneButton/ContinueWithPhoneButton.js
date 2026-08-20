import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

import Spinner from '../../Spinner/Spinner'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './styles'

const ContinueWithPhoneButton = ({
  containerStyles,
  isDisabled = false,
  isLoading = false,
  onPress,
  textStyle,
  title
}) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={isDisabled || isLoading}
      onPress={onPress}
      style={[
        styles(currentTheme).button,
        (isDisabled || isLoading) && styles(currentTheme).disabled,
        containerStyles
      ]}
    >
      {isLoading
        ? (
          <Spinner
            backColor='transparent'
            spinnerColor={currentTheme.singleVendorOnBrand}
          />
          )
        : (
          <TextDefault
            H4
            bold
            center
            style={textStyle}
            textColor={currentTheme.white}
          >
            {t(title)}
          </TextDefault>
          )}
    </TouchableOpacity>
  )
}

export default ContinueWithPhoneButton
