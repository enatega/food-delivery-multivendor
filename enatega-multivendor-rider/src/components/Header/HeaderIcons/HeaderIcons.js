import React from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import PropTypes from 'prop-types'

function BackButton(props) {
  if (props.icon === 'leftArrow') {
    return (
      <Ionicons
        name="ios-arrow-back"
        size={20}
        style={styles.leftIconPadding}
        color="#000"
      />
    )
  } else if (props.icon === 'menu') {
    return (
      <MaterialIcons
        name="menu"
        size={20}
        style={styles.leftIconPadding}
        color="#000"
      />
    )
  }
}

function LeftButton(props) {
  const navigation = useNavigation()
  if (props.icon === 'back') {
    return (
      <HeaderBackButton
        backImage={() => BackButton({ icon: 'leftArrow' })}
        onPress={() => {
          navigation.goBack()
        }}
      />
    )
  } else {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() => BackButton({ icon: 'menu' })}
        onPress={() => navigation.toggleDrawer()}
      />
    )
  }
}
LeftButton.propTypes = {
  icon: PropTypes.string
}

BackButton.propTypes = {
  icon: PropTypes.string.isRequired
}

export default LeftButton
