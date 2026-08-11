/* eslint-disable react/display-name */
import React from 'react'
import {
  RightButton,
  LeftButton
} from '../../components/Header/HeaderIcons/HeaderIcons'
import { textStyles } from '../../utils/textStyles'
import { scale } from '../../utils/scaling'

const navigationOptions = props => ({
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <RightButton
      icon="dots"
      modalVisible={option => {
        props?.modalSetter(option)
      }}
      titlePosition={option => {
        props?.passwordButton(option)
      }}
      textColor="black"
      textBackColor={props?.backColor}
    />
  ),
  title: props?.title,
  headerTitleAllowFontScaling: true,
  headerTitleAlign: 'left',
  headerTitleStyle: {
    color: props?.fontColor,
    ...textStyles.H4,
    ...textStyles.Bolder
  },
  headerTitleContainerStyle: {
    marginRight: props?.passChecker ? scale(100) : scale(35)
  },
  headerLeft: () => (
    <LeftButton
      iconColor={props?.fontColor}
      toggle={true}
      toggleValue={props?.closeIcon}
      toggleView={option => props?.closeModal(option)}
    />
  )
})
export default navigationOptions
