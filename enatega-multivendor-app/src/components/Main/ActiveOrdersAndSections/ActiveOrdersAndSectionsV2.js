import React, { useContext } from 'react'
import { View } from 'react-native'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'

function ActiveOrdersAndSections(props) {
  const { t } = useTranslation()

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View>
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontMainColor}
        style={{
          ...alignment.MLlarge,
          ...alignment.PBsmall,
          marginRight: scale(20)
        }}
        bolder
        H3>
        {t('allRestaurant')}
      </TextDefault>
    </View>
  )
}

export default ActiveOrdersAndSections
