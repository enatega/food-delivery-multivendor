import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity, StatusBar, Linking } from 'react-native'
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
import { Feather, EvilIcons } from '@expo/vector-icons'
import { customMapStyle } from '../../utils/customMapStyles'
import { useTranslation } from 'react-i18next'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import Spinner from '../../components/Spinner/Spinner'

const LATITUDE = 33.699265
const LONGITUDE = 72.974575
const LATITUDE_DELTA = 40
const LONGITUDE_DELTA = 40

export default function SelectLocation(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const { longitude, latitude } = props.route.params || {}
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const [loading, setLoading] = useState(false)
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const { setLocation } = useContext(LocationContext)
  const [label, setLabel] = useState(
    longitude && latitude ? t('currentLocation') : t('selectedLocation')
  )
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

  let mapRef = null

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('setLocation'),
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.white,
        iconColor: currentTheme.black,
        lineColor: currentTheme.lightHorizontalLine,
        setCurrentLocation
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
      Location: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      }
    })
  }

  // const setCurrentLocation = async () => {
  //   const { status, canAskAgain } = await getLocationPermission()
  //   if (status !== 'granted' && !canAskAgain) {
  //     FlashMessage({
  //       message: t('locationPermissionMessage'),
  //       onPress: async () => {
  //         await Linking.openSettings()
  //       }
  //     })
  //     return
  //   }
  //   const { error, coords, message } = await getCurrentLocation()
  //   if (error) {
  //     FlashMessage({
  //       message
  //     })
  //     return
  //   }
  //   mapRef.fitToCoordinates([
  //     {
  //       latitude: coords.latitude,
  //       longitude: coords.longitude
  //     }
  //   ])
  //   setLabel('currentLocation')
  // }

  const onSelectLocation = () => {
    setLocation({
      label,
      deliveryAddress: label,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
  }

  const onRegionChangeComplete = coords => {
    setCoordinates({
      ...coords
    })
  }

  const onPanDrag = () => {
    setLabel(t('selectedLocation'))
  }

  const onItemPress = city => {
    setModalVisible(false)
    navigation.navigate('AddNewAddress', {
      City: {
        city,
        latitude: city.latitude,
        longitude: city.longitude
      }
    })
  }

  return (
    <>
      <View style={styles().flex}>
        <View style={styles().mapView}>
          <MapView
            ref={ref => {
              mapRef = ref
            }}
            initialRegion={coordinates}
            region={coordinates}
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
        <View style={styles(currentTheme).container}>
          <TextDefault
            textColor={currentTheme.buttonText}
            H3
            bolder
            Left
            style={styles().heading}>
            {t('selectLocation')}
          </TextDefault>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).button}
            onPress={setCurrentLocation}>
            <View style={styles(currentTheme).icon}>
              <EvilIcons name="location" size={18} color="black" />
            </View>
            <TextDefault textColor={currentTheme.buttonText} H5 bold>
              Use my current Location
            </TextDefault>
            {loading && (
              <Spinner
                size={'small'}
                backColor={'transparent'}
                spinnerColor={'#fff'}
              />
            )}
          </TouchableOpacity>
          <View style={styles(currentTheme).line} />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).button}
            onPress={() => setModalVisible(true)}>
            <View style={styles(currentTheme).icon}>
              <Feather name="list" size={18} color="black" />
            </View>

            <TextDefault textColor={currentTheme.buttonText} H5 bold>
              Browse All Cities
            </TextDefault>
          </TouchableOpacity>
          <View style={styles(currentTheme).line} />
        </View>
        <View style={{ paddingBottom: inset.bottom }} />
      </View>

      <ModalDropdown
        visible={modalVisible}
        onItemPress={onItemPress}
        onClose={() => setModalVisible(false)}
      />
    </>
  )
}
