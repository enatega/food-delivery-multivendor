import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Image
} from 'react-native'
import { useLocation } from '../../ui/hooks'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import MapView, { PROVIDER_GOOGLE, Circle, Polygon, Marker } from 'react-native-maps'
import { customMapStyle } from '../../utils/customMapStyles'
import LanguageModal from '../../components/LanguageModalize/LanguageModal'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { LocationContext } from '../../context/Location'
import markerIcon from '../../../assets/Group1000003768.png'
import CustomMarkerWithLabel from '../../assets/SVG/imageComponents/CustomMarkerWithLabel'
import useGeocoding from '../../ui/hooks/useGeocoding'
import Spinner from '../../components/Spinner/Spinner'
import ForceUpdate from '../../components/Update/ForceUpdate'
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import


export default function CurrentLocation() {
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === "rtl", ...theme[themeContext.ThemeValue] }
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const [modalVisible, setModalVisible] = useState(false)
  const [citiesModalVisible, setCitiesModalVisible] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const { getAddress } = useGeocoding()


  const { cities, setLocation } = useContext(LocationContext)


  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CURRENTLOCATION)
    }
    Track()
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.white)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    async function fetchLocation() {
      setLoading(true)
      const { status, canAskAgain } = await getLocationPermission()
      if (status !== 'granted' && !canAskAgain) {
        FlashMessage({
          message: t('locationPermissionMessage'),
          onPress: async () => {
            await Linking.openSettings()
          }
        })
        setLoading(false)
        return
      }
      const { error, coords, message } = await getCurrentLocation()
      if (error) {
        console.log(message, error)
        // FlashMessage({
        //   message
        // })   commenting out this message because server side messages must not be shown to the client (security)
        setLoading(false)
        return
      }
      setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude })
      setLoading(false)
    }
    fetchLocation()
  }, [])

  const initialRegion = {
    latitude: 33.342119,
    longitude: 35.483114,
    latitudeDelta: 1.1,
    longitudeDelta: 1.1
  }


  const handleMarkerPress = async (coordinates) => {
    setCitiesModalVisible(false)
    setLoading(true)
    const response = await getAddress(coordinates.latitude, coordinates.longitude)
    setLocation({
      label: 'Location',
      deliveryAddress: response.formattedAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      city: response.city
    })
    setLoading(false)
    navigation.navigate('Main')
  }


  useEffect(() => {
    async function checkLanguage() {
      const lang = await AsyncStorage.getItem('enatega-language');
      if (!lang) {
        setModalVisible(true);
      }
    }
    checkLanguage();
  }, []);

  return (
    <>
      <View
        style={[
          styles().flex,
          {
            backgroundColor: currentTheme.themeBackground,
            // paddingTop: inset.top
          }
        ]}
      >
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().mapView}>

            <MapView
              style={styles().flex}
              provider={PROVIDER_GOOGLE}
              customMapStyle={customMapStyle}
              region={initialRegion}
            >
              {currentLocation && (
                <Marker
                  coordinate={currentLocation}
                  onPress={() => handleMarkerPress(currentLocation)}
                />
              )}

              {cities.map(city => (
                <React.Fragment key={city.id}>
                  <CustomMarkerWithLabel
                    coordinate={{ latitude: city.latitude, longitude: city.longitude }}
                    label={city.name}
                    icon={markerIcon}
                    currentTheme={currentTheme}
                    onPress={() => handleMarkerPress({ latitude: city.latitude, longitude: city.longitude })}
                  />

                  {city?.location && city?.location.coordinates && city.location.coordinates[0] && (
                    <Polygon
                      coordinates={city.location.coordinates[0].map(coord => ({
                        latitude: coord[1],
                        longitude: coord[0]
                      }))}
                      strokeColor={currentTheme.orderComplete}
                      fillColor={currentTheme.radiusFill}
                      strokeWidth={2}
                    />
                  )}

                </React.Fragment>
              ))}
            </MapView>

          </View>

          <View style={styles(currentTheme).subContainerImage}>
            {loading && <Spinner spinnerColor={currentTheme.spinnerColor} backColor={currentTheme.themeBackground} />}
            <TextDefault
              textColor={currentTheme.fontMainColor}
              center
              bolder
              H2
              style={styles(currentTheme).welcomeHeading}
            >
              {t('welcomeScreen')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              center
              style={styles(currentTheme).descriptionEmpty}
            >
              {t('enategaUseYourLocationMessage')}
            </TextDefault>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).linkButton}
              onPress={() => setCitiesModalVisible(true)}
            >
              <TextDefault textColor={currentTheme.fontMainColor} H5 center>
                {t('exploreYallaCities')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
        
        {!modalVisible && <ForceUpdate />}

        <LanguageModal
          currentTheme={currentTheme}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          dontClose
        />
        <ModalDropdown
          theme={currentTheme}
          visible={citiesModalVisible}
          onItemPress={handleMarkerPress}
          onClose={() => setCitiesModalVisible(false)}
        />
      </View>
    </>
  )
}
