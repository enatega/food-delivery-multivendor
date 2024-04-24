import React, { useContext } from 'react'
import { View, Dimensions, Text } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useNavigation } from '@react-navigation/native'
import { DAYS } from '../../../utils/enums'
import Animated from 'react-native-reanimated'
import {
  BorderlessButton,
  FlatList,
  RectButton,
  TouchableOpacity
} from 'react-native-gesture-handler'
import { alignment } from '../../../utils/alignment'
import TextError from '../../Text/TextError/TextError'
import { textStyles } from '../../../utils/textStyles'
import {useTranslation} from 'react-i18next'

const { height } = Dimensions.get('screen')
const TOP_BAR_HEIGHT = height * 0.05
const AnimatedIon = Animated.createAnimatedComponent(Ionicons)
const AnimatedBorderless = Animated.createAnimatedComponent(BorderlessButton)

function ImageTextCenterHeader(props, ref) {
  const flatListRef = ref
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const {t} = useTranslation()
  const aboutObject = {
    latitude: props.restaurant ? props.restaurant.location.coordinates[1] : '',
    longitude: props.restaurant ? props.restaurant.location.coordinates[0] : '',
    address: props.restaurant ? props.restaurant.address : '',
    restaurantName: props.restaurantName,
    restaurantImage: props.restaurantImage,
    deliveryTime: props.restaurant ? props.restaurant.deliveryTime : '...',
    average: props.restaurant ? props.restaurant.reviewData.ratings : '...',
    total: props.restaurant ? props.restaurant.reviewData.total : '...',
    reviews: props.restaurant ? props.restaurant.reviewData.reviews : '...',
    isAvailable: props.restaurant ? props.restaurant.isAvailable : true,
    openingTimes: props.restaurant ? props.restaurant.openingTimes : [],
    isOpen: () => {
      if (!props.restaurant) return true
      const date = new Date()
      const day = date.getDay()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const todaysTimings = props.restaurant.openingTimes.find(
        o => o.day === DAYS[day]
      )
      const times = todaysTimings.times.filter(
        t =>
          hours >= Number(t.startTime[0]) &&
          minutes >= Number(t.startTime[1]) &&
          hours <= Number(t.endTime[0]) &&
          minutes <= Number(t.endTime[1])
      )

      return times.length > 0
    }
  }

  const emptyView = () => {
    return (
      <View
        style={{
          width: '100%',
          height: verticalScale(40),
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <TextError text={t('noItemsExists')} />
      </View>
    )
  }
  return (
    <Animated.View
      style={[
        styles(currentTheme).mainContainer,
        {
          height: props.height,
          backgroundColor: props.loading ? 'transparent' : 'null'
        }
      ]}>
      <Animated.View
        style={{
          height: Animated.sub(props.height, TOP_BAR_HEIGHT),
          backgroundColor: 'white'
        }}>
        <Animated.Image
          resizeMode="cover"
          source={{ uri: aboutObject.restaurantImage }}
          style={[
            styles().flex,
            {
              opacity: props.opacity,
              borderBottomLeftRadius: scale(20),
              borderBottomRightRadius: scale(20)
            }
          ]}
        />
        <Animated.View style={styles().overlayContainer}>
          <View style={styles().fixedViewNavigation}>
            <View style={styles().fixedIcons}>
              <AnimatedBorderless
                activeOpacity={0.7}
                rippleColor={currentTheme.rippleColor}
                style={[
                  styles().touchArea,
                  {
                    backgroundColor: props.iconBackColor,
                    borderRadius: props.iconRadius,
                    height: props.iconTouchHeight,
                    width: scale(60)
                  }
                ]}
                onPress={() => navigation.goBack()}>
                <AnimatedIon
                  name="arrow-back"
                  style={{
                    color: props.black,
                    fontSize: props.iconSize
                  }}
                />
              </AnimatedBorderless>
              <Animated.Text
                numberOfLines={1}
                style={[
                  styles(currentTheme).headerTitle,
                  {
                    opacity: Animated.sub(1, props.opacity),
                    marginBottom: props.headerTextFlex
                  }
                ]}>
                {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
              </Animated.Text>
              {!props.loading && (
                <>
                  <AnimatedBorderless
                    activeOpacity={0.7}
                    rippleColor={currentTheme.rippleColor}
                    style={[
                      styles().touchArea,
                      {
                        backgroundColor: props.iconBackColor,
                        borderRadius: props.iconRadius,
                        height: props.iconTouchHeight,
                        width: props.iconTouchWidth
                      }
                    ]}
                    onPress={() => {
                      navigation.navigate('About', {
                        restaurantObject: {
                          ...aboutObject,
                          isOpen: null
                        },
                        tab: true
                      })
                    }}>
                    {
                      <AnimatedIon
                        name="ios-information-circle-outline"
                        style={{
                          color: props.black,
                          fontSize: props.iconSize
                        }}
                      />
                    }
                  </AnimatedBorderless>
                </>
              )}
            </View>
          </View>
          <Animated.View
            style={[styles().fixedView, { opacity: props.opacity }]}>
            <View style={styles().fixedText}>
              <TextDefault
                H4
                bolder
                Center
                textColor={currentTheme.fontWhite}
                numberOfLines={1}
                ellipsizeMode="tail">
                {aboutObject.restaurantName.length > 12
                  ? `${aboutObject.restaurantName.slice(0, 15)}...`
                  : aboutObject.restaurantName}
              </TextDefault>

              {!props.loading && (
                <View style={styles(currentTheme).deliveryBox}>
                  <TextDefault
                    style={[alignment.PRxSmall, alignment.PLxSmall]}
                    textColor="white"
                    bold>
                    {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
                  </TextDefault>
                </View>
              )}
              {!props.loading && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles().ratingBox}
                  onPress={() => {
                    navigation.navigate('About', {
                      restaurantObject: { ...aboutObject, isOpen: null },
                      tab: false
                    })
                  }}>
                  <MaterialIcons
                    name="star"
                    size={scale(15)}
                    color={currentTheme.white}
                  />
                  <TextDefault
                    style={[alignment.PRxSmall, alignment.PLxSmall]}
                    textColor="white"
                    bold>
                    {aboutObject.average} ({aboutObject.total})
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
      {!props.loading && (
        <FlatList
          ref={flatListRef}
          style={styles(currentTheme).flatListStyle}
          contentContainerStyle={{ flexGrow: 1 }}
          data={props.loading ? [] : props.topaBarData}
          horizontal={true}
          ListEmptyComponent={emptyView()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={
                props.selectedLabel === index
                  ? styles(currentTheme).activeHeader
                  : null
              }>
              <RectButton
                activeOpacity={0.05}
                rippleColor={currentTheme.rippleColor}
                onPress={() => props.changeIndex(index)}
                style={styles(currentTheme).headerContainer}>
                <View style={styles().navbarTextContainer}>
                  <TextDefault
                    style={
                      props.selectedLabel === index
                        ? textStyles.Bolder
                        : textStyles.Small
                    }
                    textColor={
                      props.selectedLabel === index
                        ? currentTheme.tagColor
                        : currentTheme.fontMainColor
                    }
                    center
                    uppercase
                    small>
                    {item.title}
                  </TextDefault>
                </View>
              </RectButton>
            </View>
          )}
        />
      )}
    </Animated.View>
  )
}

export default React.forwardRef(ImageTextCenterHeader)
