import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'

function Location(props) {
  const { location } = useContext(LocationContext)
  return (
    <View style={styles.headerTitleContainer}>
      <View style={styles.headerContainer}>
        <TextDefault
          textColor={props.style.color}
          style={{ minWidth: '25%' }}
          right>
          Deliver to:
        </TextDefault>
        <TouchableOpacity
          activeOpacity={1}
          onPress={props.modalOn}
          style={styles.textContainer}>
          <TextDefault textColor={props.linkColor} numberOfLines={1} H5 bolder>
            {' '}
            {location.label}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Location
