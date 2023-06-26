/* eslint-disable react/display-name */
import React from 'react'
import {
  RightButton,
  LeftButton
} from '../../components/Header/HeaderIcons/HeaderIcons'
import { textStyles } from '../../utils/textStyles'
import { scale } from '../../utils/scaling'
import { View } from 'react-native'

const navigationOptions = props => ({
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <RightButton
      icon="dots"
      modalVisible={option => {
        props.modalSetter(option)
      }}
      titlePosition={option => {
        props.passwordButton(option)
      }}
      textColor="black"
      textBackColor={props.backColor}
    />
  ),
  title: props.title,
  headerTitleAllowFontScaling: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#F5F5F5',
  },
  headerTitleStyle: {

    color: props.fontColor,
    ...textStyles.H4,
    ...textStyles.Bolder
  },
  headerTitleContainerStyle: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    marginLeft: 0,
    //marginRight: props.passChecker ? scale(100) : scale(35)
  },
  headerLeft: () => (
    <View style={{backgroundColor: 'white', borderRadius: 50 , marginLeft: 10, width: 55, alignItems: 'center'}}>
    <LeftButton
      iconColor="black"
      toggle={true}
      toggleValue={props.closeIcon}
      toggleView={option => props.closeModal(option)}
    />
    </View>
  )
})
export default navigationOptions
