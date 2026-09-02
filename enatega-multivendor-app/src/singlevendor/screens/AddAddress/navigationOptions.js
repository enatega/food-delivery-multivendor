/* eslint-disable react/display-name */
import React from 'react'
import styles from './Styles'
import { AntDesign, Entypo } from '@expo/vector-icons'

const navigationOptions = (props) => {
  return props.state == 'map'
    ? {
        headerShown: false
      }
    : {
        headerShown: true,
        title: props.title,
        headerStyle: {
          shadowColor: 'transparent',
          shadowRadius: 0
        },
        headerTitleStyle: {
          color: props?.fontMainColor
        },
        // headerTitleAlign: 'center',
        headerRight: null,
        headerLeft: () => (
          <Entypo
            onPress={() => {
              if (props.state === 'searched') {
                props.setState('searching')
              } else {
                console.log('props.state=>', props.state)
                props?.navigation.goBack()
              }
            }}
            name='cross'
            size={24}
            color={props?.iconColor}
            style={[styles(props?.currentTheme).headerLeftIcon, { backgroundColor: props.currentTheme.colorBgTertiary }]}
          />
        )
      }
}
export default navigationOptions
