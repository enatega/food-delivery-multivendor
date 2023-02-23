import React, { useEffect } from 'react'
import { View, TouchableOpacity, Linking, Alert } from 'react-native'
import * as Location from 'expo-location'
import styles from './styles'
import { useLocationContext } from '../../context/location'
import TextDefault from '../../components/Text/TextDefault/TextDefault'

const LocationPermissions = ({ navigation }) => {
  const { setLocationPermission } = useLocationContext()

  const getLocationPermission = async() => {
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status === 'granted') {
      setLocationPermission(true)
    }
  }

  const LocationAlert = async() => {
    Alert.alert(
      'Location access',
      'Location permissions are required to use this app. Kindly open settings to allow location access.',
      [
        {
          text: 'Open settings',
          onPress: async() => {
            await Linking.openSettings()
          }
        }
      ]
    )
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status === 'granted') {
      setLocationPermission(true)
    }
  }

  const askLocationPermission = async() => {
    const {
      status,
      canAskAgain
    } = await Location.getForegroundPermissionsAsync()
    if (status === 'granted') {
      setLocationPermission(true)
    }
    if (canAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        setLocationPermission(true)
      } else {
        LocationAlert()
      }
    } else {
      LocationAlert()
    }
  }

  useEffect(() => {
    getLocationPermission()
  }, [])

  return (
    <>
      <View style={[styles().flex]}>
        <View style={styles().descriptionEmpty}>
          <TextDefault H5 bolder center>
            {
              'Enatega uses your location for features like finding orders nearby and tracking customer orders!'
            }
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles().linkButton}
          onPress={() => {
            askLocationPermission()
          }}>
          <TextDefault H4 bold center>
            {'Allow Location'}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default LocationPermissions
