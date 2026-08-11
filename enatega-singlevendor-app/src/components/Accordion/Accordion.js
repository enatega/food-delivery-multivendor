import React, { useContext, useState } from 'react'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { TouchableOpacity, View } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { Entypo } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

const Accordion = ({ heading, children }) => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const accordionStyles = styles(currentTheme)

  return (
    <View style={accordionStyles.container}>
      <TouchableOpacity style={accordionStyles.header} onPress={() => setOpen(!open)} activeOpacity={0.5}>
        <TextDefault bold H5 style={accordionStyles.heading} textColor={currentTheme.newFontcolor} isRTL>{heading}</TextDefault>
        <Entypo name={open ? 'chevron-small-up' : 'chevron-small-down'} size={24} color={currentTheme.darkBgFont} style={accordionStyles.icon} />
      </TouchableOpacity>
      {open ? <View style={accordionStyles.body}>{children}</View> : null}
    </View>
  )
}

export default Accordion
