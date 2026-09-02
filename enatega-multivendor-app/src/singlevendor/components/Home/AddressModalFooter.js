import { ActivityIndicator, Alert, View, Pressable } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import styles from './Styles'
import UserContext from '../../../context/User'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import { useLocation } from '../../../ui/hooks'
import useGeocoding from '../../../ui/hooks/useGeocoding'
import { checkLocationInCities } from '../../../utils/locationUtil'

const AddressModalFooter = ({ onClose }) => {
  const navigation = useNavigation()

  const { isLoggedIn } = useContext(UserContext)
  const { setLocation, cities } = useContext(LocationContext)
  const { getCurrentLocation } = useLocation()
  const { getAddress } = useGeocoding()
  const [isLocating, setIsLocating] = useState(false)

  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])

  const useCurrentLocation = async() => {
    if (isLocating) return

    setIsLocating(true)
    try {
      const result = await getCurrentLocation({ preferStored: false })
      const latitude = Number(result?.coords?.latitude)
      const longitude = Number(result?.coords?.longitude)

      if (result?.error || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error(result?.message || t('locationUnavailable', { defaultValue: 'Current location is unavailable. Please try again.' }))
      }

      const point = { latitude, longitude }
      const serviceArea = cities?.length ? checkLocationInCities(point, cities) : null
      if (cities?.length && !serviceArea) {
        Alert.alert(
          t('outsideDeliveryArea', { defaultValue: 'Outside delivery area' }),
          t('locationNotInZone', { defaultValue: 'Your current location is outside our delivery area.' })
        )
        return
      }

      const address = await getAddress(latitude, longitude)
      setLocation({
        label: t('currentLocation', { defaultValue: 'Current Location' }),
        latitude,
        longitude,
        deliveryAddress: address?.formattedAddress,
        city: address?.city || serviceArea?.name
      })
      onClose()
    } catch (error) {
      Alert.alert(
        t('locationError', { defaultValue: 'Location error' }),
        error?.message || t('locationUnavailable', { defaultValue: 'Current location is unavailable. Please try again.' })
      )
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <View>
      <Pressable
        disabled={isLocating}
        style={styles.addButton}
        onPress={useCurrentLocation}
      >
        <View style={styles.addressSubContainer}>
          {isLocating
            ? <ActivityIndicator size='small' color={currentTheme.singleVendorBrandForeground} />
            : <AntDesign name='enviromento' size={scale(20)} color={currentTheme.singleVendorBrandForeground} />}
          <View style={styles.mL5p} />
          <TextDefault bold H5 textColor={currentTheme.singleVendorBrandForeground}>
            {isLocating ? t('locating', { defaultValue: 'Locating…' }) : t('useCurrentLocation', { defaultValue: 'Use Current Location' })}
          </TextDefault>
        </View>
      </Pressable>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate('AddAddress')
          } else {
            onClose()
            navigation.navigate({ name: 'CreateAccount' })
          }
        }}
      >
        <View style={styles.addressSubContainer}>
          <AntDesign name='plus' size={scale(20)} color={currentTheme.darkBgFont} />
          <View style={styles.mL5p} />
          <TextDefault bold H5 textColor={currentTheme.darkBgFont}>
            {t('addAddress')}
          </TextDefault>
        </View>
      </Pressable>
    </View>
  )
}

export default AddressModalFooter
