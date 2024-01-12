import React from 'react'
import { ActivityIndicator } from 'react-native'
import CustomColors from '../../utilities/colors'
function Spinner(props) {
  const { colors } = CustomColors()
  return (
    <ActivityIndicator
      size="large"
      color={props.spinnerColor ?? colors.spinnerColor}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    />
  )
}

export default Spinner
