/* eslint-disable react/display-name */
import React from 'react'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const navigationOptions = props => ({

  headerStyle: {
    backgroundColor: theme.Pink.headerColor,
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
  headerLeft: () => <LeftButton iconColor={props.iconColorPink} />,
  headerTitle: headerProp => (
    <SelectedLocation
      {...headerProp}
      modalOn={() => props.open()}
      linkColor={props.iconColorPink}
    />
  )
})
export default navigationOptions
