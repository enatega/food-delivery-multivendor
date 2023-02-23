import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import TextDefault from '../../Text/TextDefault/TextDefault'

function ImageHeader(props) {
  const navigation = useNavigation()
  return (
    <View style={styles().mainContainer}>
      <Image
        style={styles().headerImage}
        resizeMode="cover"
        source={{ uri: props.restaurantImage }}
      />
      {/* Fixed Position on image */}
      <View style={styles().overlayContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(props.iconBackColor).touchArea}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="ios-arrow-back"
            size={scale(20)}
            color={props.iconColor}
          />
        </TouchableOpacity>
      </View>
      <TextDefault style={styles().headingTitle} textColor="white" H4 bold>
        {props.restaurantName}
      </TextDefault>
    </View>
  )
}

export default ImageHeader
