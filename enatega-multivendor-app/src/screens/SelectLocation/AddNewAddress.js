import React, {
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect
} from 'react'
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { LocationContext } from '../../context/Location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { customMapStyle } from '../../utils/customMapStyles'
import darkMapStyle from '../../utils/DarkMapStyles'
import { useTranslation } from 'react-i18next'
import SearchModal from '../../components/Address/SearchModal'
import { Feather } from '@expo/vector-icons'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { useNavigation } from '@react-navigation/native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import screenOptions from './screenOptions'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'
import useGeocoding from '../../ui/hooks/useGeocoding'
import blackmarker from '../../assets/images/user.png'

// Default location if current location can't be retrieved
const DEFAULT_LATITUDE = 33.95
const DEFAULT_LONGITUDE = 73.56
const LATITUDE_DELTA = 0.035
const LONGITUDE_DELTA = 0.035

export default function AddNewAddress(props) {
  const { isLoggedIn } = useContext(UserContext)
  const { getAddress } = useGeocoding()
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [cityModalVisible, setCityModalVisible] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [initialLocation, setInitialLocation] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE
  })

  const { longitude, latitude, id, prevScreen } = props?.route.params || {}

  const [selectedValue, setSelectedValue] = useState({
    city: '',
    address: '',
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude
  })
  const { setLocation } = useContext(LocationContext)
  const mapRef = useRef()
  const { t, i18n } = useTranslation()

  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const { getCurrentLocation } = useLocation()

  const setCurrentLocation = async () => {
    try {
      const { coords, error } = await getCurrentLocation()
      if (!error && coords) {
        // Update initial location and map view
        const newLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
        
        setInitialLocation(newLocation)
        
        // Update selected value with geocoded address
        const response = await getAddress(coords.latitude, coords.longitude)
        setSelectedValue({
          city: response.city,
          address: response.formattedAddress,
          latitude: coords.latitude,
          longitude: coords.longitude
        })

        // Animate map to current location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }, 1000)
        }
      } else {
        // Handle error getting location
        Alert.alert(
          t('locationError'),
          t('unableToGetLocation'),
          [{ text: t('ok') }]
        )
      }
    } catch (error) {
      console.error('Error setting current location:', error)
      Alert.alert(
        t('locationError'),
        t('unableToGetLocation'),
        [{ text: t('ok') }]
      )
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('addAddress'),
        fontColor: currentTheme.newFontcolor,
        backColor: currentTheme.newheaderBG,
        iconColor: currentTheme.newIconColor,
        lineColor: currentTheme.newIconColor,
        setCurrentLocation,
        locationPrevScreen: prevScreen
      })
    )
  }, [prevScreen])

  // Fetch current location on component mount
  useEffect(() => {
    setCurrentLocation()
  }, [])

  const onSelectCity = (item) => {
    setCoordinates({
      latitude: +item.latitude,
      longitude: +item.longitude
    }, false)  // Don't tilt when selecting city
    setCityModalVisible(false)
  }

  const onRegionChangeComplete = useCallback(async (coordinates) => {
    try {
      const response = await getAddress(
        coordinates.latitude,
        coordinates.longitude
      )
      setSelectedValue({
        city: response.city,
        address: response.formattedAddress,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      })
    } catch (error) {
      console.log('Error fetching address:', error)
    }
  }, [])

  const setCoordinates = useCallback((location, shouldTilt = false) => {
    if (mapRef.current) {
      // Regular position change without tilt
      if (!shouldTilt) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // Closer zoom, but not too close
          longitudeDelta: 0.01
        }, 500)
      } 
      // Optional 3D view with tilt
      else {
        mapRef.current.animateCamera({
          center: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          pitch: 45,
          heading: 0,
          zoom: 18,
          altitude: 0
        }, { duration: 1000 })
      }
    }
  }, [])

  const onSelectLocation = () => {
    setLocation({
      label: 'Location',
      deliveryAddress: selectedValue.address,
      latitude: selectedValue.latitude,
      longitude: selectedValue.longitude,
      city: selectedValue.city
    })
    if (isLoggedIn) {
      navigation.navigate('SaveAddress', {
        locationData: {
          id,
          label: 'Location',
          deliveryAddress: selectedValue.address,
          latitude: selectedValue.latitude,
          longitude: selectedValue.longitude,
          city: selectedValue.city,
          prevScreen: props?.route.params.prevScreen
            ? props?.route.params.prevScreen
            : null
        }
      })
    } else {
      navigation.navigate('Main')
    }
  }

  return (
    <>
      <View style={styles().flex}>
        <View style={[styles().mapView, { height: '55%', zIndex: -10 }]}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1, width: '100%', height: '100%' }}
            initialRegion={{
              latitude: initialLocation.latitude,
              longitude: initialLocation.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            customMapStyle={
              themeContext.ThemeValue === 'Dark' 
                ? darkMapStyle 
                : customMapStyle
            }
            onRegionChangeComplete={onRegionChangeComplete}
            showsBuildings={true}
            showsIndoors={true}
            showsCompass={true}
            pitchEnabled={true}
            rotateEnabled={true}
            toolbarEnabled={true}
            moveOnMarkerPress={false}
            showsPointsOfInterest={true}
            zoomEnabled={true}
            scrollEnabled={true}
            zoomControlEnabled={true}
            zoomTapEnabled={true}
            maxZoomLevel={22}
            minZoomLevel={1}
            mapType='standard'
            onMapReady={() => setMapReady(true)}
          />
          
          {/* Marker overlay with pointer events disabled */}
          <View style={styles().mainContainer} pointerEvents='none'>
            <Image
              source={blackmarker}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
                transform: [{ translateY: -20 }]
              }}
            />
          </View>
          
          {/* Zoom buttons for easier control */}
          <View style={styles().zoomButtonsContainer}>
            <TouchableOpacity
              style={styles(currentTheme).zoomButton}
              onPress={() => {
                if (mapRef.current) {
                  // Toggle between top-down and 3D tilted view
                  mapRef.current.animateCamera({
                    center: {
                      latitude: selectedValue.latitude,
                      longitude: selectedValue.longitude
                    },
                    pitch: 45, // Tilted view
                    zoom: 18,
                    heading: 0
                  }, { duration: 1000 })
                }
              }}
            >
              <TextDefault center bold textColor={currentTheme.fontMainColor}>3D</TextDefault>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles(currentTheme).zoomButton}
              onPress={() => {
                if (mapRef.current) {
                  // Return to top-down view
                  mapRef.current.animateCamera({
                    center: {
                      latitude: selectedValue.latitude,
                      longitude: selectedValue.longitude
                    },
                    pitch: 0, // Top-down view
                    zoom: 17,
                    heading: 0
                  }, { duration: 1000 })
                }
              }}
            >
              <TextDefault center bold textColor={currentTheme.fontMainColor}>2D</TextDefault>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles(currentTheme).container2}>
          <TextDefault
            textColor={currentTheme.newFontcolor}
            H3
            bolder
            isRTL
            style={styles().addressHeading}
          >
            {t('addAddress')}
          </TextDefault>
          <CityModal
            theme={currentTheme}
            setCityModalVisible={setCityModalVisible}
            selectedValue={selectedValue.city}
            cityModalVisible={cityModalVisible}
            onSelect={onSelectCity}
            t={t}
          />

          <View style={[styles(currentTheme).textInput]}>
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              <TextDefault textColor={currentTheme.newFontcolor} isRTL>
                {selectedValue.address || t('address')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={onSelectLocation}
            disabled={!selectedValue.address || !selectedValue.city}
          >
            <TextDefault textColor={currentTheme.buttonText} center H5>
              {t('saveBtn')}
            </TextDefault>
          </TouchableOpacity>
          <SearchModal
            visible={searchModalVisible}
            onClose={() => setSearchModalVisible(false)}
            onSubmit={(description, coords) => {
              setSearchModalVisible(false)
              setCoordinates({
                latitude: coords.lat,
                longitude: coords.lng
              }, false) // Don't tilt when searching
            }}
          />
        </View>
        <View style={{ paddingBottom: inset.bottom }} />
      </View>
    </>
  )
}

const CityModal = React.memo(
  function CityModal({
    theme,
    setCityModalVisible,
    selectedValue,
    cityModalVisible,
    onSelect,
    t
  }) {
    return (
      <View style={styles().dropdownContainer}>
        <TouchableOpacity
          style={styles(theme).button1}
          onPress={() => {
            setCityModalVisible(true)
          }}
        >
          {selectedValue && (
            <Text style={styles(theme).cityField}>{selectedValue}</Text>
          )}
          {!selectedValue && (
            <Text style={styles(theme).cityField}>{t('selectCity')}</Text>
          )}
          <Feather
            name='chevron-down'
            size={18}
            color={theme.newIconColor}
            style={styles().icon1}
          />
        </TouchableOpacity>
        <ModalDropdown
          theme={theme}
          visible={cityModalVisible}
          onItemPress={onSelect}
          onClose={() => {
            setCityModalVisible(false)
          }}
        />
      </View>
    )
  },
  (prevprops, nextprops) => {
    return (
      prevprops?.cityModalVisible === nextprops?.cityModalVisible &&
      prevprops?.selectedValue === nextprops?.selectedValue
    )
  }
)