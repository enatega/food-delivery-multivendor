import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import { alignment } from '../../utils/alignment'
import styles from './styles'

export const MethodRow = ({
  theme,
  selected = false,
  label = 'Credit card/ Debit card',
  icons = [],
  onPress = () => {}
}) => {
  return (
    <TouchableOpacity
      style={styles.methodRow}
      onPress={onPress}
      activeOpacity={0.7}>
      <RadioButton
        size={13}
        outerColor={theme.radioOuterColor}
        innerColor={theme.radioColor}
        animation={'bounceIn'}
        isSelected={selected}
        onPress={onPress}
      />
      <MethodField theme={theme} icons={icons} label={label} />
    </TouchableOpacity>
  )
}

export const MethodField = ({ theme, icons, label }) => (
  <View
    style={[
      styles.methodDescription,
      { backgroundColor: theme.inputBackground }
    ]}>
    <Text>{label}</Text>
    <View style={styles.iconsRow}>
      {icons.map((Icon, index) => (
        <View style={alignment.MLxSmall} key={label + 'payment-icon-' + index}>
          <Icon />
        </View>
      ))}
    </View>
  </View>
)
