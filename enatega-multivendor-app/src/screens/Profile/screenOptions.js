/* eslint-disable react/display-name */
import React from 'react'
import {
  RightButton,
  LeftButton
} from '../../components/Header/HeaderIcons/HeaderIcons'
import { textStyles } from '../../utils/textStyles'
import { scale } from '../../utils/scaling'
import { View } from 'react-native'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'

const navigationOptions = props => ({
  // eslint-disable-next-line react/display-name
  headerRight: () => (
    <View style={{ paddingRight: 10 }}>
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
    </View>
  ),
  title: props.title,
  headerTitleAllowFontScaling: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#F5F5F5',
    border: 1,
    borderColor: 'white',
    borderRadius: scale(10)
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
    marginLeft: 0,
    border: 1,
    borderColor: 'white',
    borderRadius: scale(10)
    //marginRight: props.passChecker ? scale(100) : scale(35)
  },
  headerLeft: () => (
    <HeaderBackButton
      backImage={() => (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 50,
            marginLeft: 10,
            width: 55,
            alignItems: 'center'
          }}>
          <MaterialIcons name="arrow-back" size={30} color="black" />
        </View>
      )}
      onPress={() => {
        navigationService.goBack()
      }}
    />
  )
})
export default navigationOptions
