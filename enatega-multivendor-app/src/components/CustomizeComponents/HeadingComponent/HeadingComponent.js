import React, { useContext } from 'react'
import { View } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import { calculateDiscountedPrice } from '../../../utils/calculateDiscountedPrice'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'

function HeadingComponent(props) {
  const { i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }

  const withoutDiscountPrice = calculateDiscountedPrice(props?.price, props?.discountedPrice)

  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).topContainer}>
        <View style={styles(currentTheme).titleContainer}>
          <TextDefault numberOfLines={2} textColor={currentTheme.colors.textPrimary} H4 bolder>
            {props?.title}
          </TextDefault>
        </View>
         <View style={styles(currentTheme).priceContainer}>
          <TextDefault numberOfLines={1} textColor={currentTheme.colors.textPrimary} H4 bolder>
            {configuration.currencySymbol} {props?.price}
          </TextDefault>
          {props?.discountedPrice && props?.discountedPrice > 0 && (
            <TextDefault small bold textColor={currentTheme.colors.textMuted} style={styles(currentTheme).discountedPrice}>
              {configuration.currencySymbol} {withoutDiscountPrice}
            </TextDefault>
          )}
        </View>
      </View>
      {!!props?.desc && <View style={styles(currentTheme).descContainer}>
        <TextDefault numberOfLines={2} textColor={currentTheme.colors.textSecondary} bold>
          {props?.desc}
        </TextDefault>
      </View>}
    </View>
  )
}

export default HeadingComponent
