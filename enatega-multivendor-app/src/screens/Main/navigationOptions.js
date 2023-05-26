/* eslint-disable react/display-name */
import React from 'react'
import { StyleSheet } from 'react-native'
import {
  LeftButton,
  RightButton
} from '../../components/Header/HeaderIcons/HeaderIcons'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'

const navigationOptions = props => ({
  headerStyle: {
    backgroundColor: props.headerMenuBackground,
    borderBottomColor: props.horizontalLine,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerTransparent: true,
  headerTitleStyle: {
    color: props.fontMainColor
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerLeft: () => <LeftButton iconColor={props.iconColorPink} />,
  headerRight: () => (
    <RightButton icon="favourite" iconColor={props.iconColor} />
  ),
  headerTitle: headerProp => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props.open()}
      linkColor={props.iconColorPink}
    />
  )
})
export default navigationOptions
