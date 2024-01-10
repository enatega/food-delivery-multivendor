import React, { useContext, useEffect, useState } from 'react'
import { View, StatusBar, TouchableOpacity, Linking } from 'react-native'
import { useLocation } from '../../ui/hooks'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import LocationPermission from '../../assets/SVG/imageComponents/LocationPermission'
import { scale } from '../../utils/scaling'
import analytics from '../../utils/analytics'
import Spinner from '../../components/Spinner/Spinner'
import { useTranslation } from 'react-i18next'
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
    navigation.navigate('SelectLocation', { ...coords })
  }
  StatusBar.setBarStyle('light-content')
  return (
    <>
      <View
        style={[
          styles().flex,
          {
            backgroundColor: currentTheme.headerBackground,
            paddingTop: inset.top
          }
        ]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().subContainerImage}>
            <View style={styles().imageContainer}>
              <LocationPermission width={scale(300)} height={scale(300)} />
            </View>
            <View style={styles().descriptionEmpty}>
              <TextDefault textColor={currentTheme.fontMainColor} bolder center>
                {t('enategaUseYourLocationMessage')}
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).emptyButton}
              onPress={setCurrentLocation}>
              <TextDefault
                style={{ paddingLeft: loading ? 40 : 0 }}
                textColor={currentTheme.buttonText}
                bolder
                center
                uppercase>
                {t('useCurrentLocation')}
              </TextDefault>
              {loading && (
                <Spinner
                  size={'small'}
                  backColor={'transparent'}
                  spinnerColor={'#fff'}
                />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles().linkButton}
            onPress={() => {
              navigation.navigate('SelectLocation')
            }}>
            <TextDefault
              textColor={currentTheme.buttonBackgroundPink}
              H5
              bold
              center>
              {t('selectAnotherLocation')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingBottom: inset.bottom }} />
    </>
  )
}
