import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ConfigurationContext from '../../../context/Configuration'
import styles from './styles'
import {
  FontAwesome5,
} from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

function OrderAgainCard(props) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)

  return (
    
      <TouchableOpacity
        style={styles(currentTheme).offerContainer}
        activeOpacity={1}
        onPress={() => navigation.navigate('Restaurant', { ...props })}>
        <View style={styles().imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: props.image }}
            style={styles().restaurantImage}
          />

        </View>

        <View style={styles().descriptionContainer}>
          <View style={styles().aboutRestaurant}>
            <TextDefault
              H5
              numberOfLines={1}
              textColor={currentTheme.fontThirdColor}
              bolder>
              {props.name}
            </TextDefault>

          </View>
          <TextDefault
            textColor={currentTheme.fontNewColor}
            numberOfLines={1}
            bold
            Normal
            style={styles().offerCategoty}>
            {props?.tags?.slice(0,2)?.join(', ')}
          </TextDefault>
          <View style={styles().deliveryInfo}>
            <View style={styles().deliveryTime}>
              <TextDefault
                textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                {props.deliveryTime + ' '}
                {t('min')}
              </TextDefault>
            
            </View>
            <View style={styles().deliveryTime}>
              <TextDefault
                textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                {configuration.currencySymbol}{configuration?.deliveryRate}
              </TextDefault>
            </View>

            <View style={styles().aboutRestaurant}>
              <FontAwesome5 name="star" color={currentTheme.orange} />

              <TextDefault
                textColor={currentTheme.fontThirdColor}
                style={styles().restaurantRatingContainer}
                bold
                >
                {props.reviewAverage}
              </TextDefault>
            </View>

          </View>
        </View>
      </TouchableOpacity>
   
  )
}

export default React.memo(OrderAgainCard)
