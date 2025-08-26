import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef
} from 'react'
import { View, TouchableOpacity, StatusBar, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
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
import { Feather, EvilIcons } from '@expo/vector-icons'
import { customMapStyle } from '../../utils/customMapStyles'
import { useTranslation } from 'react-i18next'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import Spinner from '../../components/Spinner/Spinner'

const LATITUDE = 32.953491
const LONGITUDE = 35.211990
const LATITUDE_DELTA = 0.02
const LONGITUDE_DELTA = 0.02

export default function SelectLocation(props) {

  const Analytics = analytics()

  const { t, i18n } = useTranslation()
  const { longitude, latitude } = props?.route.params || {}
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() == 'rtl', ...theme[themeContext.ThemeValue]}
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)
  const mapRef = useRef()
  const { getCurrentLocation, getLocationPermission } = useLocation()

  const [coordinates, setCoordinates] = useState({
    latitude: latitude || LATITUDE,
    longitude: longitude || LONGITUDE,
    latitudeDelta: latitude ? 0.003 : LATITUDE_DELTA,
    longitudeDelta: longitude ? 0.003 : LONGITUDE_DELTA
  })
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_SELECTLOCATION)
    }
    Track()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('setLocation'),
        fontColor: currentTheme.newFontcolor,
        backColor: currentTheme.newheaderBG,
        iconColor: currentTheme.newIconColor,
        lineColor: currentTheme.newIconColor,
        setCurrentLocation,
        locationPrevScreen : props?.route?.params?.prevScreen
      })
    )
  })


  StatusBar.setBarStyle('dark-content')

  const setCurrentLocation = async () => {
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
      FlashMessage({
        message
      })
      setLoading(false)
      return
    }
    setLoading(false)
    navigation.navigate('AddNewAddress', {
      latitude: coords.latitude,
      longitude: coords.longitude,
      prevScreen: props?.route?.params?.prevScreen ? props?.route?.params?.prevScreen : null
    })
  }

  const onRegionChangeComplete = (coords) => {
    setCoordinates({
      ...coords
    })
  }

  const onItemPress = (city) => {
    setModalVisible(false)
    navigation.navigate('AddNewAddress', {
      latitude: +city.latitude,
      longitude: +city.longitude,
      prevScreen: props?.route?.params?.prevScreen ? props?.route?.params?.prevScreen : null
    })
  }

  return (
    <>
      <View style={styles().flex}>
        <View style={styles().mapView}>
          <MapView
            ref={mapRef}
            initialRegion={coordinates}
            region={coordinates}
            style={{ flex: 1 }}
            provider={PROVIDER_DEFAULT}
            showsTraffic={false}
            maxZoomLevel={15}
            customMapStyle={customMapStyle}
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
        <View style={styles(currentTheme).container}>
          <TextDefault
            textColor={currentTheme.newFontcolor}
            H3
            bolder
            isRTL
            style={styles(currentTheme).heading}
          >
            {t('selectLocation')}
          </TextDefault>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).button}
            onPress={setCurrentLocation}
          >
            <View style={styles(currentTheme).icon}>
              <EvilIcons name='location' size={18} color='black' />
            </View>
            <TextDefault textColor={currentTheme.newFontcolor} H5 bold>
              {t('useCurrentLocation')}
            </TextDefault>
            {loading && (
              <Spinner
                size={'small'}
                backColor={currentTheme.color3}
                spinnerColor={currentTheme.main}
              />
            )}
          </TouchableOpacity>

          <View style={styles(currentTheme).line} />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).button}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles(currentTheme).icon}>
              <Feather name='list' size={18} color='black' />
            </View>

            <TextDefault textColor={currentTheme.newFontcolor} H5 bold>
              {t('browseCities')}
            </TextDefault>
          </TouchableOpacity>

          <View style={styles(currentTheme).line} />
        </View>
        <View style={{ paddingBottom: inset.bottom }} />
      </View>

      <ModalDropdown
        theme={currentTheme}
        visible={modalVisible}
        onItemPress={onItemPress}
        onClose={() => setModalVisible(false)}
      />
    </>
  )
}
