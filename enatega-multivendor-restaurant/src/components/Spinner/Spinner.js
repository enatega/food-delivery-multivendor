import React from 'react'
import { ActivityIndicator } from 'react-native'
import { colors } from '../../utilities'

function Spinner(props) {
  return (
    <ActivityIndicator
      size="large"
      color={props.spinnerColor ?? colors.spinnerColor}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    />
  )
}
export default Spinner
