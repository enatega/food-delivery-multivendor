import React, { useContext } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
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
  console.log(props.rating)
  return (
    <View style={styles().mainContainer}>
      <Image
        style={styles().headerImage}
        resizeMode="cover"
        source={{ uri: props.restaurantImage }}
      />
      {/* Fixed Position on image */}
      <Animated.View style={styles().overlayContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(props.iconBackColor).touchArea}
          
          onPress={() => navigation.goBack()}>
            <AnimatedIon
                  name="ios-arrow-back"
                  style={{
                    color: props.black,
                    fontSize: scale(20)
                  }}
              />
          
        </TouchableOpacity>
        <View style={styles(currentTheme).deliveryBox}>
            <TextDefault
              textColor="white"
              bold>
              Delivery {props.deliveryTime} Minute
            </TextDefault>
        </View>
      </Animated.View>
      {/*<Animated.View>
        <Animated.Text
          numberOfLines={1} style={{color: 'black'}}>
          Delivery {props.deliveryTime} Minute{' '}
      </Animated.Text>
                </Animated.View>*/}
    </View>
  )
}

export default ImageHeader
