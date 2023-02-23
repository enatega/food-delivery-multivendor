import { View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import styles from './style'
import TextDefault from '../Text/TextDefault/TextDefault'
import colors from '../../utilities/colors'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import ConfigurationContext from '../../context/configuration'

const Amount = ({
  text,
  amount,
  icon = false,
  shadow = false,
  disabled = true,
  bg = false
}) => {
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AvailableCash', { prevBtn: 'wallet' })
      }
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, shadow && styles.shadow, bg && styles.bg]}>
      <TextDefault H4 bold textColor={bg ? colors.white : colors.black}>
        {text}
      </TextDefault>
      <View style={styles.amount}>
        <TextDefault
          style={styles.sign}
          H2
          bold
          textColor={bg ? colors.white : colors.black}>
          {configuration.currencySymbol}
        </TextDefault>
        <TextDefault H1 bold textColor={bg ? colors.white : colors.black}>
          {amount}
        </TextDefault>
        {icon && (
          <FontAwesome5
            style={styles.icon}
            name="chevron-right"
            size={24}
            color={bg ? colors.white : colors.black}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Amount
