/* eslint-disable react/display-name */
import React from 'react'
import { StyleSheet } from 'react-native'
import SelectedLocation from '../../../components/Main/Location/Location'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

const navigationOptions = (props) => ({
  headerStyle: {
    backgroundColor: props?.headerMenuBackground,
    shadowColor: 'transparent',
    shadowRadius: 0,
    elevation: 0,
    overflow: 'visible',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: props?.headerBorderColor
  },
  headerTitleStyle: {
    color: props?.fontMainColor,
    ...alignment.PTlarge
  },
  headerTitleContainerStyle: {
    left: scale(8),
    right: scale(118),
    alignItems: 'flex-start'
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
