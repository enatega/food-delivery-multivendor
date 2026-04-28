import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'

const LATITUDE = 33.7001019
const LONGITUDE = 72.9735978
const LATITUDE_DELTA = 0.0022
const LONGITUDE_DELTA = 0.0021

export default function FullMap(props) {
  const Analytics = analytics()

  const latitude = props?.route.params.latitude ?? LATITUDE
  const longitude = props?.route.params.longitude ?? LONGITUDE
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()

  const [mapMargin, setMapMargin] = useState(1)
  const [region, setRegion] = useState({
    latitude: latitude,
    latitudeDelta: LATITUDE_DELTA,
    longitude: longitude,
    longitudeDelta: LONGITUDE_DELTA
  })
  const backScreen = props?.route.params.currentScreen ?? null
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOTPASSWORD)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: t('addAddress')
    })
  }, [props?.navigation])

  function setMargin() {
    setMapMargin(0)
  }

  function onSave() {
    if (backScreen === 'NewAddress') {
      props?.navigation.navigate('NewAddress', { regionChange: region })
    } else if (backScreen === 'EditAddress') {
      props?.navigation.navigate('EditAddress', { regionChange: region })
    }
  }

  return (
    <>
      <View
        style={[
          styles().flex,
          {
            backgroundColor: currentTheme.themeBackground
          }
        ]}>
        <MapView
          style={[styles().container, { marginTop: mapMargin }]}
          initialRegion={region}
          loadingEnabled={true}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          provider={PROVIDER_DEFAULT}
          customMapStyle={mapStyle}
          showsMyLocationButton
          onMapReady={setMargin}
          showsTraffic={false}
          region={region}
        />
        <View style={styles().customMarkerContainer}>
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
          onPress={onSave}>
          <TextDefault textColor={currentTheme.buttonText} H4 bold>
            Save
          </TextDefault>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}
