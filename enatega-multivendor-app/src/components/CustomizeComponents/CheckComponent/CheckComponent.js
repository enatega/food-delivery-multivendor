import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import CheckboxBtn from '../../../ui/FdCheckbox/CheckboxBtn'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../../context/Configuration'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'

function CheckComponent(props) {
  const { i18n } = useTranslation()
  const [options, setOptions] = useState(
    props?.options?.map(option => ({ ...option, checked: props?.selected?.some((selected) => selected._id === option._id) || false }))
  )
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue], ...tokens }

  function onPress(option) {
    setOptions((currentOptions) => currentOptions.map((currentOption) =>
      currentOption._id === option._id
        ? { ...currentOption, checked: !currentOption.checked }
        : currentOption
    ))
    props?.onPress(option)
  }

  return (
    <View>
      {options?.map(option => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress.bind(this, option)}
          key={option._id}
          style={styles(currentTheme).mainContainer}>
          <View style={styles(currentTheme).leftContainer}>
            <CheckboxBtn
              onPress={onPress.bind(this, option)}
              checked={option.checked}
            />
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.colors.textPrimary}
              // style={[alignment.MLsmall, alignment.PRsmall, alignment.MRlarge]}
              style={styles(currentTheme).title}
              H6
              bolder>
              {option.title}
            </TextDefault>
          </View>
          <View style={styles(currentTheme).rightContainer}>
            <TextDefault
              textColor={currentTheme.colors.textSecondary}
              H6
              bolder>{`${configuration.currencySymbol}${option.price}`}</TextDefault>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default CheckComponent
