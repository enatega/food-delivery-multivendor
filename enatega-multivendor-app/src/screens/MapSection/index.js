import React, { useContext } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { mapStyle } from '../../utils/mapStyle'
import styles from './styles'
import { Image, View, Text, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../utils/scaling'
import { useRoute } from '@react-navigation/native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import Bicycle from '../../assets/SVG/Bicycle'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

export default function MapSection() {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const route = useRoute()
  const navigation = useNavigation()
  const location = route?.params?.location
  const restaurants = route?.params?.restaurants
  console.log('Location => ', JSON.stringify(route?.params, null, 3))

  return (
    <View>
      <MapView
        style={styles().map}
        showsUserLocation
        zoomEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        <Marker coordinate={location} title='Current Address'>
          <Image source={require('../../assets/images/user.png')} width={20} />
        </Marker>
        {restaurants &&
          restaurants.map((rest, index) => {
            const coord = {
              latitude: parseFloat(rest.location.coordinates[1]),
              longitude: parseFloat(rest.location.coordinates[0])
            }
            return (
              <Marker
                coordinate={coord}
                key={index}
                onPress={() => {
                  navigation.navigate('Restaurant', { ...rest })
                }}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('../../assets/images/res.png')}
                  width={20}
                />
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: scale(8)
                  }}
                >
                  <Text>{rest.name}</Text>
                </View>
              </Marker>
            )
          })}
      </MapView>
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 9999
        }}
      >
        <FlatList
          data={restaurants}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: 310,
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: scale(8),
                  gap: 16
                }}
              >
                <Image
                  resizeMode='cover'
                  source={{ uri: item.image }}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: scale(10),
                    overflow: 'hidden'
                  }}
                />
                <View style={{ gap: 8 }}>
                  <TextDefault H5 bolder>
                    {item.name}
                  </TextDefault>
                  <TextDefault numberOfLines={1} bold Normal>
                    {item?.tags?.slice(0, 2)?.join(', ')}
                  </TextDefault>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: scale(18)
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(4)
                      }}
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
                        Normal
                      >
                        {item.deliveryTime + ' '} min
                        {/* {t('min')} */}
                      </TextDefault>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(4)
                      }}>
                      <Bicycle />

                      <TextDefault
                        textColor={currentTheme.color2}
                        numberOfLines={1}
                        bold
                        Normal
                      >
                        ${item.tax}
                      </TextDefault>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: scale(2)
                      }}
                    >
                      <FontAwesome5
                        name='star'
                        size={14}
                        color={currentTheme.color2}
                      />

                      <TextDefault bold Normal>
                        {item.reviewAverage}
                      </TextDefault>
                      <TextDefault bold Normal>
                        ({item.reviewCount})
                      </TextDefault>
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={{ flexGrow: 1, gap: 16, marginHorizontal: 15 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    </View>
  )
}
