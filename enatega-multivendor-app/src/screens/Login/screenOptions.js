import React from 'react'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'

const navigationOptions = props => {
  return {
    title: null,
    // eslint-disable-next-line react/display-name
    headerRight: () => (
      <Ionicons
        onPress={() =>
          props.navigation.navigate({
            name: 'Main',
            merge: true
          })
        }
        name="close"
        size={24}
        color={props.iconColor}
        style={styles().headerRightIcon}
      />
    ),
    // eslint-disable-next-line react/display-name
    headerLeft: () => (
      <Ionicons
        onPress={() => props.navigation.goBack()}
        name="chevron-back"
        size={24}
        color={props.iconColor}
        style={styles().headerLeftIcon}
      />
    ),
    headerStyle: {
      backgroundColor: props.backColor
    }
  }
}
export default navigationOptions
