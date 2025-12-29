import React from 'react'
import styles from './Styles'
import { AntDesign } from '@expo/vector-icons'

const navigationOptions = (props) => {
  return {
    title: null,
    headerRight: null,
    headerTransparent: true,
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0 // Remove shadow on iOS
    },
    headerLeft: () => <AntDesign onPress={() => props?.navigation.goBack()} name='arrowleft' size={24} color={props?.iconColor} style={styles(props?.currentTheme).headerLeftIcon} />,
    headerStyle: {
      backgroundColor: 'transparent'
    }
  }
}
export default navigationOptions
