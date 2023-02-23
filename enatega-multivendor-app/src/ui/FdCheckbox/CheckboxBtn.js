import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import styles from './styles'
import { scale } from '../../utils/scaling'
import ThemeContext from '../ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

function CheckboxBtn(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles(currentTheme).mainContainer,
        props.checked
          ? { backgroundColor: currentTheme.radioColor }
          : { backgroundColor: currentTheme.fontWhite }
      ]}>
      {props.checked ? (
        <AntDesign
          name="check"
          size={scale(10)}
          color={currentTheme.fontWhite}
        />
      ) : null}
    </TouchableOpacity>
  )
}
export default CheckboxBtn
