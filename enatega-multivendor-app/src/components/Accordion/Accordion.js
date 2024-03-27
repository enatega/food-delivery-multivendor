import React, { useContext, useState } from 'react'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { TouchableOpacity, View } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { Entypo } from '@expo/vector-icons';

const Accordion = ({ heading, children }) => {
  const [open, setOpen] = useState(false)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles(currentTheme).container}>
      <TouchableOpacity style={styles().header} onPress={() => setOpen(!open)} activeOpacity={0.5}>
        <TextDefault bold H5 style={styles().heading} textColor={currentTheme.newFontcolor}>{heading}</TextDefault>
        <Entypo name={open ? "chevron-small-up" : "chevron-small-down"} size={24} color={currentTheme.darkBgFont} />
      </TouchableOpacity>
      {open ? children : null}
    </View>
  )
}

export default Accordion
