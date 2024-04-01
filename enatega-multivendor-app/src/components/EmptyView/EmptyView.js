import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const EmptyView = ({ title, description, buttonText }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
    const themeContext = useContext(ThemeContext)
    const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles().mainContainerEmpty}>
      <View style={styles().subContainerImage}>
        <View style={styles().imageContainer}>
          <EmptyCart width={scale(200)} height={scale(200)} />
        </View>
        <View style={styles().descriptionEmpty}>
          <TextDefault bolder center B700 textColor={currentTheme.newFontcolor}>
            {t(title)}
          </TextDefault>
          <TextDefault center textColor={currentTheme.newFontcolor}>{t(description)}</TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).emptyButton}
          onPress={() =>
            navigation.navigate({
              name: 'Main',
              merge: true
            })
          }>
          <TextDefault
            textColor={currentTheme.black}
            bolder
            B700
            center
            uppercase>
            {t(buttonText)}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EmptyView
