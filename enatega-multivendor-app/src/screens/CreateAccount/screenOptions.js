import React from 'react'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'

const navigationOptions = props => ({
  headerTitle: '',
  headerRight: null,
  // eslint-disable-next-line react/display-name
  headerLeft: () => (
    // eslint-disable-next-line react/react-in-jsx-scope
    <LeftButton iconColor={props.iconColor} icon="close" />
  ),
  headerStyle: {
    shadowOffset: {
      height: 0
    },
    backgroundColor: props.backColor
  }
})
export default navigationOptions
