import React from 'react'
import styles from './styles'
import { AntDesign } from '@expo/vector-icons'

const navigationOptions = props => {
  return {
    title: null,
    // eslint-disable-next-line react/display-name
    headerRight: () => (
      <AntDesign
        onPress={() =>
          props?.navigation.navigate({
            name: 'Main',
            merge: true
          })
        }
        name='closecircleo'
        size={24}
        color={props?.fontColor}
        style={styles().headerRightIcon}
      />
    ),
    // eslint-disable-next-line react/display-name
    headerLeft: null,
    headerStyle: {
      backgroundColor: props?.backColor
    }
  }
}
export default navigationOptions
