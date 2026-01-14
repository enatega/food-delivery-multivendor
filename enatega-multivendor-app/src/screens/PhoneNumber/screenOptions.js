import React from 'react'
import styles from './styles'
import { AntDesign } from '@expo/vector-icons'

const navigationOptions = props => {
  return {
    title: null,
    // eslint-disable-next-line react/display-name
    headerRight: () => (
      <AntDesign
        onPress={() => props?.navigation.goBack()}
        name="close-circle"
        size={24}
        color={props?.iconColor}
        style={styles().headerRightIcon}
      />
    ),
    // eslint-disable-next-line react/display-name
    headerLeft: () => (
      <AntDesign
        onPress={() => props?.navigation.goBack()}
        name="left"
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
