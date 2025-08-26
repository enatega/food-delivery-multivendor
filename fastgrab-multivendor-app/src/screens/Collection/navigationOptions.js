/* eslint-disable react/display-name */
import React from 'react'
import { alignment } from '../../utils/alignment'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const navigationOptions = props => ({
  title: null,
      headerLeft: () => (
        <TouchableOpacity onPress={() => props?.navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={props?.backIconColor} />
        </TouchableOpacity>
      ),
      headerRight: null,
      headerStyle: {
        backgroundColor: props?.headerMenuBackground,
        shadowOpacity: 0,
      },
      headerTitleContainerStyle: {
        alignItems: 'flex-start',
        backgroundColor:' red',
        ...alignment.MLxSmall
      },
      headerLeftContainerStyle: {
        paddingLeft: 10, 
      },
      headerRightContainerStyle: {
        paddingRight: 10,
      },
})
export default navigationOptions
