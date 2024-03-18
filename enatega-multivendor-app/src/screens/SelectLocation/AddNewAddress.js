import React, {
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect
} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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
import { useLocation } from '../../ui/hooks'

const LATITUDE = 33.699265
const LONGITUDE = 72.974575
const LATITUDE_DELTA = 0.2
const LONGITUDE_DELTA = 0.2

export default function AddNewAddress(props) {
  const [searchModalVisible, setSearchModalVisible] = useState()
  const [cityModalVisible, setCityModalVisible] = useState(false)

  const { longitude, latitude } = props.route.params || {}
  const [selectedValue, setSelectedValue] = useState({
    city: '',
    address: '',
    latitude: LATITUDE,
    longitude: LONGITUDE
  })
  const { setLocation } = useContext(LocationContext)
  const mapRef = useRef()

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const { getCurrentLocation } = useLocation()

  const { t } = useTranslation()
  const setCurrentLocation = async() => {
    const { coords, error } = await getCurrentLocation()
    if (!error) {
      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude
      })
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('addAddress'),
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.white,
        iconColor: currentTheme.black,
        lineColor: currentTheme.lightHorizontalLine,
        setCurrentLocation
      })
    )
  }, [])

  const onSelectCity = item => {
    setCoordinates({
      latitude: +item.latitude,
      longitude: +item.longitude
    })
    setCityModalVisible(false)
  }

  const onRegionChangeComplete = useCallback(async coordinates => {
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
  })

  const setCoordinates = useCallback(location => {
    mapRef.current.fitToCoordinates([
      {
        latitude: location.latitude,
        longitude: location.longitude
      }
    ])
  })

  useEffect(() => {
    onRegionChangeComplete({ longitude, latitude })
  }, [])

  const onSelectLocation = () => {
    setLocation({
      label: 'Location',
      deliveryAddress: selectedValue.address,
      latitude: selectedValue.latitude,
      longitude: selectedValue.longitude,
      city: selectedValue.city
    })
  }

  return (
    <>
      <View style={styles().flex}>
        <View style={[styles().mapView, { height: '55%' }]}>
          <MapView
            ref={mapRef}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
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
            {t('addAddress')}
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
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={onSelectLocation}>
            <TextDefault textColor={currentTheme.buttonText} center H5>
              Save
            </TextDefault>
          </TouchableOpacity>
          <SearchModal
            visible={searchModalVisible}
            onClose={() => setSearchModalVisible(false)}
            onSubmit={(description, coords) => {
              setCoordinates({
                latitude: coords.lat,
                longitude: coords.lng
              })
              setSearchModalVisible(false)
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
