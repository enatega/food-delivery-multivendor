import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import styles from './styles'
import { Image, View, FlatList, TouchableOpacity, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Bicycle from '../../assets/SVG/Bicycle'
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import ConfigurationContext from '../../context/Configuration'
import { useTranslation } from 'react-i18next'

export default function MapSection() {
  const { i18n } = useTranslation()
  const mapRef = useRef()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  const route = useRoute()
  const navigation = useNavigation()
  const location = route?.params?.location
  const restaurants = route?.params?.restaurants
  const [visibleMarkerIndex, setVisibleMarkerIndex] = useState(0)
  const configuration = useContext(ConfigurationContext)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation, currentTheme])

  const handleMarkerAnimate = (coord) => {
    mapRef.current.animateToRegion({
      ...coord,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    })
  }

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleMarkerIndex(viewableItems[0].index)
    }
  }

  useEffect(() => {
    if (!restaurants?.length || !restaurants || !visibleMarkerIndex) return
    const rest = restaurants[visibleMarkerIndex]
    const coord = {
      latitude: parseFloat(rest.location.coordinates[1]),
      longitude: parseFloat(rest.location.coordinates[0])
    }
    handleMarkerAnimate(coord)
}, [visibleMarkerIndex])

  return (
    <View>
      <MapView
        ref={mapRef}
        style={styles().map}
        showsUserLocation
        zoomEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={false}
        // provider={PROVIDER_DEFAULT}
        // customMapStyle={mapStyle}
        initialRegion={{
          latitude: restaurants?.length
            ? parseFloat(restaurants[0].location?.coordinates[1])
            : location.latitude,
          longitude: restaurants?.length
            ? parseFloat(restaurants[0].location?.coordinates[0])
            : location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        <Marker coordinate={location} title='Current Address'>
          <Image source={require('../../assets/images/user.png')} style={styles().userMarkerImage} />
        </Marker>
        {restaurants &&
          restaurants?.map((rest, index) => {
            const coord = {
              latitude: parseFloat(rest.location.coordinates[1]),
              longitude: parseFloat(rest.location.coordinates[0])
            }
            return (
              <Marker
                coordinate={coord}
                key={index}
                onPress={() => {
                  if (rest.shopType === 'grocery' || rest.shopType === 'store') {
                    navigation.navigate('NewRestaurantDetailDesign', { ...rest })
                  } else {
                    navigation.navigate('Restaurant', { ...rest })
                  }
                }}
                style={styles().markerContainer}
              >
                <View
                  style={styles(currentTheme).greenDot}
                />
                <Image
                  source={{uri: rest?.image}}
                  width={20}
                  style={styles().markerImage}
                />
                
              </Marker>
            )
          })}
      </MapView>
      <View
        style={styles().restContainer}
      >
        <FlatList
          data={restaurants}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles(currentTheme).restCard}
                onPress={() => {
                  if (item.shopType === 'grocery' || item.shopType === 'store') {
                    navigation.navigate('NewRestaurantDetailDesign', { ...item })
                  } else {
                    navigation.navigate('Restaurant', { ...item })
                  }
                }}
                activeOpacity={0.8}
              >
                <Image
                  resizeMode='cover'
                  source={{ uri: item?.image }}
                  style={styles().restImg}
                />
                <View style={{ gap: 3 }}>
                  <TextDefault
                    H5
                    bolder
                    textColor={currentTheme.buttonText}
                  >
                    {item.name}
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    bold
                    Normal
                    textColor={currentTheme.subText}
                  >
                    {item?.tags?.slice(0, 2)?.join(', ')}
                  </TextDefault>
                  <View
                    style={styles().restInfo}
                  >
                    <View
                      style={styles().deliveryTime}
                    >
                      <Bicycle color={currentTheme.color2} />

                      <TextDefault
                        textColor={currentTheme.color2}
                        numberOfLines={1}
                        bold
                        Small
                      >
                        {configuration.currencySymbol}{' '}{configuration.deliveryRate}
                      </TextDefault>
                    </View>
                    <View
                      style={styles().deliveryTime}
                    >
                      <AntDesign
                        name='clockcircleo'
                        size={14}
                        color={currentTheme.editProfileButton}
                      />

                      <TextDefault
                        textColor={currentTheme.editProfileButton}
                        numberOfLines={1}
                        bold
                        Small
                      >
                        {item.deliveryTime + ' '} min
                      </TextDefault>
                    </View>
                    <View
                      style={styles().deliveryTime}
                    >
                      <FontAwesome5
                        name='star'
                        size={14}
                        color={currentTheme.color2}
                      />

                      <TextDefault bold Small>
                        {item.reviewAverage}
                      </TextDefault>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={{ flexGrow: 1, gap: 16, marginHorizontal: 15, paddingRight: 50 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          inverted={currentTheme?.isRTL ? true : false}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 60 : 15,
          left: 15,
          backgroundColor: currentTheme.white,
          borderRadius: 50,
          height: 40,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Ionicons name='arrow-back' size={24} color='black' />
      </TouchableOpacity>
    </View>
  )
}
