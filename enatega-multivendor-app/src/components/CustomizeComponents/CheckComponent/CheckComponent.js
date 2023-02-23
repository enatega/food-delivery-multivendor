import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import CheckboxBtn from '../../../ui/FdCheckbox/CheckboxBtn'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../../context/Configuration'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'

function CheckComponent(props) {
  const [options, setOptions] = useState(
    props.options.map(option => ({ ...option, checked: false }))
  )
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  function onPress(option) {
    const tempOptions = options
    const index = tempOptions.findIndex(opt => opt._id === option._id)
    tempOptions[index].checked = !tempOptions[index].checked
    setOptions(tempOptions)
    props.onPress(option)
  }

  return (
    <View>
      {options.map(option => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress.bind(this, option)}
          key={option._id}
          style={styles.mainContainer}>
          <View style={styles.leftContainer}>
            <CheckboxBtn
              onPress={onPress.bind(this, option)}
              checked={option.checked}
            />
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontSecondColor}
              style={[alignment.MLsmall, alignment.PRsmall, alignment.MRlarge]}
              H5
              bold>
              {option.title}
            </TextDefault>
          </View>
          <View style={styles.rightContainer}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              H5
              bold>{`${configuration.currencySymbol} ${option.price}`}</TextDefault>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default CheckComponent
