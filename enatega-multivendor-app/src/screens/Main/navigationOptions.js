/* eslint-disable react/display-name */
import React, { useContext, useEffect } from 'react'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'


const navigationOptions = props => ({
  headerStyle: {
    backgroundColor: props != null ? props.headerMenuBackground : 'white',
    shadowColor: 'transparent',
    shadowRadius: 0
  },
  headerTitleStyle: {
    color: props.fontMainColor
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerLeft: () => <LeftButton iconColor={props.fontMainColor} />,
  headerTitle: headerProp => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props.open()}
      linkColor={props.fontMainColor}
    />
  )
})
export default navigationOptions
