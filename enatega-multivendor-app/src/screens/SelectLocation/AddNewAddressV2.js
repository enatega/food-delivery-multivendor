import React, {
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect
} from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { LocationContext } from '../../context/Location'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import styles from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import { customMapStyle } from '../../utils/customMapStyles'
import { useTranslation } from 'react-i18next'
import SearchModal from '../../components/Address/SearchModal'
import { Feather } from '@expo/vector-icons'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { fetchAddressFromCoordinates } from '../../utils/geocoding'
import { useNavigation } from '@react-navigation/native'
import MapView from './MapView'
import screenOptions from './screenOptions'

const LATITUDE = 33.699265
const LONGITUDE = 72.974575
const LATITUDE_DELTA = 40
const LONGITUDE_DELTA = 40

export default function AddNewAddress(props) {
  const { longitude, latitude } = props.route.params?.location || {}
  console.log('AddNewAddress', latitude, longitude)
  // city, latitude, longitude
  const locationData = props.route.params?.locationData || {}
  const [searchModalVisible, setSearchModalVisible] = useState()
  const [cityModalVisible, setCityModalVisible] = useState(false)
  const [selectedValue, setSelectedValue] = useState({
    city: locationData.city !== null ? locationData.city : '',
    address:
      locationData.deliveryAddress !== null ? locationData.deliveryAddress : '',
    latitude: locationData.latitude !== null ? locationData.latitude : '',
    longitude: locationData.longitude !== null ? locationData.longitude : ''
  })
  const { location, setLocation } = useContext(LocationContext)
  const mapRef = useRef()

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('addAddress'),
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.white,
        iconColor: currentTheme.black,
        lineColor: currentTheme.lightHorizontalLine
      })
    )
  }, [])

  const onSelectCity = item => {
    console.log('Items:', item)
    setSelectedValue({
      city: item.name,
      address: '',
      latitude: item.latitude,
      longitude: item.longitude
    })
    setCoordinates({ longitude: item.longitude, latitude: item.latitude })
    setCityModalVisible(false)
  }

  const onRegionChangeComplete = useCallback(async coordinates => {
    console.log('onRegionChangeComplete', coordinates)
    const response = await fetchAddressFromCoordinates(
      coordinates.latitude,
      coordinates.longitude
    )
    setSelectedValue({
      city: response.city,
      address: response.formattedAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
    // populate city, address info based on coordinates
  })

  const onSelectSearch = location => {
    setCoordinates(location)
  }

  const setCoordinates = useCallback(location => {
    mapRef.current.fitToCoordinates([
      {
        latitude: location.latitude,
        longitude: location.longitude
      }
    ])
  })

  useEffect(() => {
    console.log('useEffect')
    setCoordinates({ longitude, latitude })
  }, [])

  const onSelectLocation = () => {
    if (location) {
      const locationData = {
        label: 'Other',
        deliveryAddress: selectedValue.address,
        latitude: selectedValue.latitude,
        longitude: selectedValue.longitude,
        city: selectedValue.city
      }
      navigation.navigate('SaveAddress', { locationData })
    } else {
      setLocation({
        label: 'Other',
        deliveryAddress: selectedValue.address,
        latitude: selectedValue.latitude,
        longitude: selectedValue.longitude,
        city: selectedValue.city
      })
      navigation.navigate('Main')
    }
  }

  console.log(
    'Selected Value:',
    JSON.stringify(props.route.params?.locationData, null, 2)
  )

  return (
    <>
      <View style={styles().flex}>
        <View style={[styles().mapView, { height: '55%' }]}>
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            customMapStyle={
              themeContext.ThemeValue === 'Dark'
                ? customMapStyle
                : customMapStyle
            }
            onRegionChangeComplete={onRegionChangeComplete}
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
            {t('address')}
          </TextDefault>
          <CityModal
            setCityModalVisible={setCityModalVisible}
            selectedValue={selectedValue.city}
            cityModalVisible={cityModalVisible}
            onSelect={onSelectCity}
          />
          <View style={[styles(currentTheme).textInput]}>
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              <Text
                style={{
                  color: currentTheme.buttonText,
                  overflow: 'scroll'
                }}>
                {selectedValue.address || 'Address'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={[styles(currentTheme).textInput]}>
            <TextInput
              style={[styles().flex, { color: currentTheme.buttonText }]}
              placeholder="Address"
              placeholderTextColor={currentTheme.placeholderText}
              value={selectedValue.address}
              onChangeText={text => {}}
            />
            <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
              <MaterialIcons
                name="edit"
                size={18}
                color={currentTheme.darkBgFont}
                style={{ marginRight: 10, marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={onSelectLocation}>
            {location ? (
              <TextDefault textColor={currentTheme.buttonText} center H4 bold>
                Next
              </TextDefault>
            ) : (
              <TextDefault textColor={currentTheme.buttonText} center H4 bold>
                Save
              </TextDefault>
            )}
          </TouchableOpacity>
          <SearchModal
            visible={searchModalVisible}
            onClose={() => setSearchModalVisible(false)}
            onSubmit={(...props) => {
              onSelectSearch({
                latitude: props[1].lat,
                longitude: props[1].lng
              })
              setSearchModalVisible(false)
              console.log('onSearchItemSelect', props[1].lat, props[1].lng)
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
    setCityModalVisible,
    selectedValue,
    cityModalVisible,
    onSelect
  }) {
    return (
      <View style={styles().dropdownContainer}>
        <TouchableOpacity
          style={styles().button1}
          onPress={() => {
            setCityModalVisible(true)
          }}>
          {selectedValue && <Text>{selectedValue}</Text>}
          {!selectedValue && (
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
          visible={cityModalVisible}
          onItemPress={onSelect}
          onClose={() => {
            setCityModalVisible(false)
          }}
        />
      </View>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.cityModalVisible === nextProps.cityModalVisible &&
      prevProps.selectedValue === nextProps.selectedValue
    )
  }
)
