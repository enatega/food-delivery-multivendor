import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, Linking, Platform, StatusBar, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { useLocation } from '../../ui/hooks'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import MapView, { PROVIDER_DEFAULT, Polygon, Marker } from 'react-native-maps'
import { customMapStyle } from '../../utils/customMapStyles'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { LocationContext } from '../../context/Location'
import markerIcon from '../../../assets/Group1000003768.png'
import CustomMarkerWithLabel from '../../assets/SVG/imageComponents/CustomMarkerWithLabel'
import useGeocoding from '../../ui/hooks/useGeocoding'
import Spinner from '../../components/Spinner/Spinner'
import ForceUpdate from '../../components/Update/ForceUpdate'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { checkLocationInCities } from '../../utils/locationUtil'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import useWatchLocation from '../../ui/hooks/useWatchLocation'

export default function CurrentLocation() {
  const Analytics = analytics()
  const { permission, onRequestPermission } = useWatchLocation()
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [isCheckingZone, setIsCheckingZone] = useState(false)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const [citiesModalVisible, setCitiesModalVisible] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  const { getAddress } = useGeocoding()

  const { cities, setLocation } = useContext(LocationContext)

  const checkLocationPermission = async () => {
    setLoading(true)
    const { status, canAskAgain } = await getLocationPermission()

    if (status === 'granted') {
      setLoading(false)
      navigation.replace('Main')
    } else if (status === 'denied') {
      // Permission denied but can ask again
      // Show the Allow Location screen
    } else if (status === 'blocked') {
      Alert.alert('Location Permission Blocked', 'Please enable location services in your device settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ])
      setLoading(false)
    } else {
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
    }
  }

  const filterCities = () => {
    let newCities = cities?.filter((city) => !isNaN(city.latitude) && !isNaN(city.longitude))
    return newCities
  }

  const handleMarkerPress = async (coordinates) => {
    setCitiesModalVisible(false)
    setIsCheckingZone(true)
    const response = await getAddress(coordinates.latitude, coordinates.longitude)
    setLocation({
      label: 'Location',
      deliveryAddress: response.formattedAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      city: response.city
    })
    setTimeout(() => {
      setIsCheckingZone(false)
      navigation.navigate('Main')
    }, 100)
  }

  async function getCurrentLocationOnStart() {
    if (!permission || !permission.granted) return
    setLoading(true)

    const { error, coords, message } = await getCurrentLocation()
    if (error) {
      // console.log("Location error:",message, error)
      setLoading(false)
      return
    }
    // console.log("Fetched Location:", coords);
    const userLocation = {
      latitude: coords.latitude,
      longitude: coords.longitude
    }

    setCurrentLocation(userLocation)
    // console.log("Current Location before rendering Marker:", currentLocation);
    setLoading(false)
  }

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CURRENTLOCATION)
    }
    Track()
    checkLocationPermission()
  }, [])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.white)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    getCurrentLocationOnStart()
  }, [permission])

  useEffect(() => {
    async function checkCityMatch() {
      if (!currentLocation || !cities.length) return
      // console.log("Checking city match for location:", currentLocation);
      // console.log("Cities list:", cities);

      setIsCheckingZone(true)

      const matchingCity = checkLocationInCities(currentLocation, filterCities())
      if (matchingCity) {
        try {
          const response = await getAddress(currentLocation.latitude, currentLocation.longitude)
          // console.log("Fetched Address Data:", response);
          const locationData = {
            label: 'Location',
            deliveryAddress: response.formattedAddress,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            city: response.city
          }

          setLocation(locationData)
          setTimeout(() => {
            setIsCheckingZone(false)
            navigation.navigate('Main')
          }, 100)
        } catch (error) {
          // console.error('Error getting address:', error)
          setIsCheckingZone(false)
        }
      } else {
        // console.warn("No matching city found for this location.");
        setIsCheckingZone(false)
      }
    }

    checkCityMatch()
  }, [currentLocation, cities])

  const initialRegion = {
    latitude: 16.10966,
    longitude: 71.41271,
    latitudeDelta: 130,
    longitudeDelta: 130
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return !currentLocation ? (
    <View style={allowedLocationStyles.container}>
      <Text style={allowedLocationStyles.title}>Enable Location Services</Text>
      <Text style={allowedLocationStyles.description}>We need access to your location to show nearby restaurants and provide accurate delivery services.</Text>
      <TouchableOpacity style={allowedLocationStyles.button} onPress={onRequestPermission}>
        <Text style={allowedLocationStyles.buttonText}>Allow Location Access</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View
      style={[
        styles().flex,
        {
          backgroundColor: currentTheme.themeBackground
        }
      ]}
    >
      <View style={[styles().flex, styles(currentTheme).screenBackground]}>
        <View style={styles().mapView}>
          <MapView style={styles().flex} provider={PROVIDER_DEFAULT} customMapStyle={customMapStyle} region={initialRegion}>
            {currentLocation && <Marker coordinate={currentLocation} onPress={() => handleMarkerPress(currentLocation)} />}

            {filterCities()?.map((city) => (
              <React.Fragment key={city?.id}>
                <CustomMarkerWithLabel
                  coordinate={{
                    latitude: city?.latitude,
                    longitude: city?.longitude
                  }}
                  label={city?.name}
                  icon={markerIcon}
                  currentTheme={currentTheme}
                  onPress={() =>
                    handleMarkerPress({
                      latitude: city?.latitude,
                      longitude: city?.longitude
                    })
                  }
                />

                {city?.location && city?.location?.coordinates && city?.location?.coordinates[0] && (
                  <Polygon
                    coordinates={city?.location?.coordinates[0].map((coord) => ({
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
          <TextDefault textColor={currentTheme.fontMainColor} center bolder H2 style={styles(currentTheme).welcomeHeading}>
            {t('welcomeScreen')}
          </TextDefault>
          <TextDefault textColor={currentTheme.fontMainColor} bold center style={styles(currentTheme).descriptionEmpty}>
            {t('enategaUseYourLocationMessage')}
          </TextDefault>

          <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).linkButton} onPress={() => setCitiesModalVisible(true)}>
            <TextDefault textColor={currentTheme.fontMainColor} H5 center>
              {t('exploreYallaCities')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>

      {isCheckingZone && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <ActivityIndicator size='large' color={currentTheme.spinnerColor} />
        </View>
      )}

      <ForceUpdate />

      <ModalDropdown theme={currentTheme} visible={citiesModalVisible} onItemPress={handleMarkerPress} onClose={() => setCitiesModalVisible(false)} />
    </View>
  )
}

const allowedLocationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24
  },
  button: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
