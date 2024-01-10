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

import { useTranslation } from 'react-i18next'

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
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const { setLocation } = useContext(LocationContext)
  const [label, setLabel] = useState(
    longitude && latitude ? t('currentLocation') : t('selectedLocation')
  )
  // eslint-disable-next-line no-unused-vars
  const [coordinates, setCorrdinates] = useState({
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
  }, [])
  let mapRef = null
  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        title: t('setLocation'),
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.white,
        iconColor: currentTheme.iconColorPink,
        lineColor: currentTheme.lightHorizontalLine,
        setCurrentLocation
      })
    )
  })

  StatusBar.setBarStyle('dark-content')

  const setCurrentLocation = async () => {
    const { status, canAskAgain } = await getLocationPermission()
    if (status !== 'granted' && !canAskAgain) {
      FlashMessage({
        message: t('locationPermissionMessage'),
        // 'Tap on this message to open Settings then allow app to use location from permissions.',
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
    mapRef.fitToCoordinates([
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    ])
    setLabel('currentLocation')
    // setLabel(t('currentLocation'))
  }
  const onSelectLocation = () => {
    setLocation({
      label,
      deliveryAddress: label,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
  }
  const onRegionChangeComplete = coordinates => {
    setCorrdinates({
      ...coordinates
    })
  }

  const onPanDrag = event => {
    // setLabel('Selected Location')
    setLabel(t('selectedLocation'))
  }
  return (
    <>
      <View style={styles().flex}>
        <MapView
          ref={ref => {
            mapRef = ref
          }}
          initialRegion={coordinates}
          region={coordinates}
          style={{ height: '92%' }}
          provider={PROVIDER_GOOGLE}
          showsTraffic={false}
          maxZoomLevel={15}
          customMapStyle={themeContext.ThemeValue === 'Dark' ? mapStyle : null}
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
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).button}
          onPress={onSelectLocation}>
          <TextDefault textColor={currentTheme.buttonText} H4 bold>
            {t('selectLocation')}
          </TextDefault>
        </TouchableOpacity>
      </View>
      <View style={{ paddingBottom: inset.bottom }} />
    </>
  )
}
