import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useCallback
} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Linking,
  TextInput
} from 'react-native'
import { LocationContext } from '../../context/Location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import screenOptions from './screenOptions'
import { useNavigation } from '@react-navigation/native'
import { useLocation } from '../../ui/hooks'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import analytics from '../../utils/analytics'
import { customMapStyle } from '../../utils/customMapStyles'
import { useTranslation } from 'react-i18next'
import SearchModal from '../../components/Address/SearchModal'
import { Feather } from '@expo/vector-icons'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { MaterialIcons } from '@expo/vector-icons'
import { fetchAddressFromCoordinates } from '../../utils/geocoding'

const LATITUDE = 33.699265
const LONGITUDE = 72.974575
const LATITUDE_DELTA = 40
const LONGITUDE_DELTA = 40

export default function AddNewAddress(props) {
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [customAddress, setCustomAddress] = useState('')
  const [selectedSearchAddress, setSelectedSearchAddress] = useState('')
  const Analytics = analytics()

  const { t } = useTranslation()
  const { longitude, latitude } = props.route.params || {}
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const { setLocation } = useContext(LocationContext)
  const [label, setLabel] = useState(
    longitude && latitude ? t('currentLocation') : t('selectedLocation')
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedValue, setSelectedValue] = useState(() => {
    return props.route.params && props.route.params.city
      ? props.route.params.city.name
      : null
  })

  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const onItemPress1 = item => {
    setSelectedValue(item.name) // Assuming your city object has a 'name' property
    closeModal()
  }

  const onItemPress = item => {
    onValueChange(item.value)
    closeModal()
  }
  const openSearchModal = () => {
    setSearchModalVisible(true)
  }

  const [coordinates, setCoordinates] = useState({
    latitude: latitude || LATITUDE,
    longitude: longitude || LONGITUDE,
    latitudeDelta: latitude ? 0.003 : LATITUDE_DELTA,
    longitudeDelta: longitude ? 0.003 : LONGITUDE_DELTA
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_SELECTLOCATION)
    }
    Track()
    setCurrentLocation()
  }, [])

  let mapRef = null
  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('addAddress'),
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.white,
        iconColor: currentTheme.black,
        lineColor: currentTheme.lightHorizontalLine,
        handleLocationWithoutCoords
      })
    )
  }, [])

  StatusBar.setBarStyle('dark-content')

  const setCurrentLocation = async () => {
    // Check if longitude and latitude are available in props
    if (longitude && latitude) {
      console.log('Inside setCurrentLocation', longitude, latitude)
      // Set the current location coordinates on the map
      mapRef.fitToCoordinates([
        {
          latitude,
          longitude
        }
      ])

      // Set the label to 'currentLocation'
      setLabel('currentLocation')

      // Set the current location address in the TextInput
      setCustomAddress('') // Clear previous custom address if any
      setSelectedSearchAddress('') // Clear previous selected search address if any

      try {
        // Now, fetch the address based on the obtained coordinates
        const { formattedAddress, city } = await fetchAddressFromCoordinates(
          latitude,
          longitude
        )

        // Update the customAddress state with the current location address
        setSelectedValue(city)
        setCustomAddress(formattedAddress)
      } catch (error) {
        // Handle error fetching address
        console.error('Error fetching address:', error.message)
      }
    }
  }

  const handleLocationWithoutCoords = async () => {
    console.log('inside Else in current LOcation')
    // If no coordinates are available, use the logic to get the current location as before
    const { status, canAskAgain } = await getLocationPermission()
    if (status !== 'granted' && !canAskAgain) {
      FlashMessage({
        message: t('locationPermissionMessage'),
        onPress: async () => {
          await Linking.openSettings()
        }
      })
      return
    }

    const { error, coords, message } = await getCurrentLocation()
    if (error) {
      FlashMessage({
        message
      })
      return
    }

    // Set the current location coordinates on the map
    mapRef.fitToCoordinates([
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    ])

    // Set the label to 'currentLocation'
    setLabel('currentLocation')

    // Set the current location address in the TextInput
    setCustomAddress('') // Clear previous custom address if any
    setSelectedSearchAddress('') // Clear previous selected search address if any

    try {
      // Now, fetch the address based on the obtained coordinates
      const { formattedAddress, city } = await fetchAddressFromCoordinates(
        coords.latitude,
        coords.longitude
      )

      // Update the customAddress state with the current location address
      console.log('fetch the city based on the obtained coordinates', city)
      setSelectedValue(city)
      setCustomAddress(formattedAddress)
    } catch (error) {
      // Handle error fetching address
      console.error('Error fetching address:', error.message)
    }
  }

  const onSelectSearchAddress = (address, coordinates) => {
    console.log('address', address)
    mapRef.fitToCoordinates([
      {
        latitude: coordinates.lat,
        longitude: coordinates.lng
      }
    ])
    setCustomAddress(address)
    setSelectedSearchAddress(address)
    setSearchModalVisible(false)
    console.log('onSelectSearchAddress', coordinates, typeof mapRef)
  }

  const onRegionChangeComplete = coordinates => {
    console.log('onRegionChangeComplete')
    setCoordinates({
      ...coordinates
    })
  }

  const onPanDrag = () => {
    console.log('onPanDrag')
    setLabel(t('selectedLocation'))
    setSearchModalVisible(false)
  }

  const onSelectLocation = () => {
    setLocation({
      label: selectedSearchAddress,
      deliveryAddress: customAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
  }

  return (
    <>
      <View style={styles().flex}>
        <View style={[styles().mapView, { height: '55%' }]}>
          <MapView
            ref={ref => {
              mapRef = ref
            }}
            initialRegion={coordinates}
            // region={coordinates}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            showsTraffic={false}
            maxZoomLevel={15}
            customMapStyle={
              themeContext.ThemeValue === 'Dark' ? mapStyle : customMapStyle
            }
            onRegionChangeComplete={onRegionChangeComplete}
            onPanDrag={onPanDrag}
          />
          <View style={styles().mainContainer}>
            <CustomMarker
              width={40}
              height={40}
              transform={[{ translateY: -20 }]}
              translateY={-20}
            />
          </View>
        </View>
        <View style={styles(currentTheme).container2}>
          <TextDefault
            textColor={currentTheme.buttonText}
            H3
            bolder
            Left
            style={styles().addressHeading}>
            {t('addAddress')}
          </TextDefault>
          <View style={styles().dropdownContainer}>
            <TouchableOpacity style={styles().button1} onPress={openModal}>
              {selectedValue ? (
                <Text>{selectedValue}</Text>
              ) : (
                <Text style={styles().placeholder}>Select City</Text>
              )}
              <Feather
                name="chevron-down"
                size={18}
                color="black"
                style={styles().icon1}
              />
            </TouchableOpacity>
            <ModalDropdown
              visible={modalVisible}
              onItemPress={onItemPress1}
              onClose={closeModal}
            />
          </View>

          <View style={[styles(currentTheme).textInput]}>
            <TextInput
              style={[styles().flex, { color: currentTheme.buttonText }]}
              placeholder="Address"
              placeholderTextColor={currentTheme.placeholderText}
              value={customAddress}
              //onFocus={openSearchModal}
              onChangeText={text => setCustomAddress(text)}
            />
            <TouchableOpacity onPress={openSearchModal}>
              <MaterialIcons
                name="edit"
                size={18}
                color={currentTheme.darkBgFont}
                style={{ marginRight: 10, marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={onSelectLocation}>
            <TextDefault textColor={currentTheme.buttonText} center H5>
              Save
            </TextDefault>
          </TouchableOpacity>

          {searchModalVisible ? (
            <SearchModal
              visible={searchModalVisible}
              onClose={() => setSearchModalVisible(false)}
              onSubmit={onSelectSearchAddress}
            />
          ) : null}
        </View>
        <View style={{ paddingBottom: inset.bottom }} />
      </View>
    </>
  )
}
