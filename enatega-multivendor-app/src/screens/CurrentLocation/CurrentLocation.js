import React, { useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, Linking, Platform, StatusBar } from 'react-native'
import { useLocation } from '../../ui/hooks'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import analytics from '../../utils/analytics'
import Spinner from '../../components/Spinner/Spinner'
import { useTranslation } from 'react-i18next'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { customMapStyle } from '../../utils/customMapStyles'
export default function CurrentLocation() {
  const Analytics = analytics()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const inset = useSafeAreaInsets()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation, getLocationPermission } = useLocation()

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
    StatusBar.setBarStyle( 'dark-content')
  })
  const initialRegion = {
    latitude: 31.0461,
    longitude: 34.8516,
    latitudeDelta: 1,
    longitudeDelta: 1
  }
  const markerCoordinate = { latitude: 31.0461, longitude: 34.8516 }

  const setCurrentLocation = async() => {
    setLoading(true)
    const { status, canAskAgain } = await getLocationPermission()
    if (status !== 'granted' && !canAskAgain) {
      FlashMessage({
        message: t('locationPermissionMessage'),
        onPress: async() => {
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
      longitude: coords.longitude
    })
  }

  return (
    <>
      <View
        style={[
          styles().flex,
          {
            backgroundColor: currentTheme.themeBackground,
            paddingTop: inset.top
          }
        ]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().mapView}>
            <MapView
              style={styles().flex}
              provider={PROVIDER_GOOGLE}
              customMapStyle={customMapStyle}
              region={initialRegion}>
              <Marker coordinate={markerCoordinate} />
            </MapView>
          </View>
          <View style={styles(currentTheme).subContainerImage}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              center
              bolder
              H2
              style={styles(currentTheme).welcomeHeading}>
              {t('welcomeScreen')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              center
              style={styles(currentTheme).descriptionEmpty}>
              {t('enategaUseYourLocationMessage')}
            </TextDefault>
            <View style={styles(currentTheme).line} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).emptyButton}
              onPress={setCurrentLocation}>
              <TextDefault
                style={{ paddingLeft: loading ? 40 : 0 }}
                textColor={currentTheme.buttonText}
                center
                H5>
                {t('useCurrentLocation')}
              </TextDefault>
              {loading && (
                <Spinner
                  size={'small'}
                  backColor={'trasnparent'}
                  spinnerColor={currentTheme.white}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).linkButton}
              onPress={() => {
                navigation.navigate('SelectLocation')
              }}>
              <TextDefault textColor={currentTheme.fontMainColor} H5 center>
                {t('selectAnotherLocation')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ paddingBottom: inset.bottom }} />
    </>
  )
}
