/* eslint-disable react/display-name */
import React from 'react'
import {
  RightButton,
  BackButton
} from '../../components/Header/HeaderIcons/HeaderIcons'
import { textStyles } from '../../utils/textStyles'
import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'

const screenOptions = (props) => {

  return {
    headerTitleAlign: 'center',
    title: props?.title,
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: props?.backColor,
      borderBottomColor: props?.lineColor,
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    headerTitleStyle: {
      color: props?.fontColor,
      ...textStyles.H3,
      ...textStyles.Bold,
      backgroundColor: 'transparent'
    },
    headerTitleContainerStyle: {
      marginHorizontal: scale(35)
    },
    headerBackImage: () => (
      <BackButton
        iconColor={props?.iconColor}
        icon='leftArrow'
        prevScreen={props?.locationPrevScreen}
      />
    ),
    headerRight: () => (
      <RightButton
        icon='target'
        iconColor={props?.iconColor}
        onPressRight={
          props?.setCurrentLocation
            ? props?.setCurrentLocation
            : props?.handleLocationWithoutCoords
        }
        prevScreen={props?.locationPrevScreen}
      />
    )
  }
}
export default screenOptions
