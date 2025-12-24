import React from 'react'
import styles from './styles'
import { AntDesign } from '@expo/vector-icons'

const navigationOptions = props => {
  return {
    title: null,
    headerRight: null,
    headerLeft: () => (
      <AntDesign
        onPress={() => props?.navigation.goBack()}
        name='arrowleft'
        size={24}
        color={props?.iconColor}
        style={styles().headerLeftIcon}
      />
    ),
    headerStyle: {
      backgroundColor: props?.backColor
    }
  }
}
export default navigationOptions
