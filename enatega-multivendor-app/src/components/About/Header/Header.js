import React, { useContext } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import TextDefault from '../../Text/TextDefault/TextDefault'
import Animated from 'react-native-reanimated'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
const AnimatedIon = Animated.createAnimatedComponent(Ionicons)

function ImageHeader(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()

  return (
    <View style={styles().mainContainer}>
      <Image
        style={styles().headerImage}
        resizeMode="cover"
        source={{ uri: props.restaurantImage }}
      />

      <Animated.View style={styles(currentTheme).overlayContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(props.iconBackColor).touchArea}
          onPress={() => navigation.goBack()}>
          <AnimatedIon
            name="ios-arrow-back"
            size={25}
          />
        </TouchableOpacity>
        <View style={styles(currentTheme).deliveryBoxContainer}>
          <TextDefault
            H4
            bolder
            Center
            textColor={currentTheme.fontWhite}
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.restaurantName.length > 12
              ? `${props.restaurantName.slice(0, 15)}...`
              : props.restaurantName}
          </TextDefault>
          {!props.loading && (
            <View style={{ padding: scale(5) }}>
              <TextDefault
                style={styles().deliveryBoxText}
                textColor="white"
                bold>
                Delivery {props.deliveryTime} Minute
              </TextDefault>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles().ratingContainer}>
            <MaterialIcons
              name="star"
              size={scale(15)}
              color={currentTheme.white}
            />
            <TextDefault
              style={styles().deliveryBoxText}
              textColor="white"
              bold>
              {props.rating} ({props.total})
            </TextDefault>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default ImageHeader
