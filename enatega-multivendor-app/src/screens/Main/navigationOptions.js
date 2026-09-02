/* eslint-disable react/display-name */
import React from 'react'
import { Dimensions } from 'react-native'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const navigationOptions = (props) => ({
  headerStyle: {
    shadowColor: 'transparent',
    shadowRadius: 0,
    backgroundColor:props?.headerMenuBackground
  },
  headerTitleStyle: {
    color: props?.fontMainColor,
    ...alignment.PTlarge
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    // React Navigation shrink-wraps a custom headerTitle, which collapses the
    // flex:1 address text and left only the location icon visible. Give the
    // title area a definite width (leaving room for the cart on the right) so
    // the selected address renders next to the icon again.
    width: SCREEN_WIDTH * 0.78,
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerTitle: (headerProp) => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props?.open()}
      linkColor={props?.fontMainColor}
      navigation={props?.navigation}
    />
  )
})
export default navigationOptions
