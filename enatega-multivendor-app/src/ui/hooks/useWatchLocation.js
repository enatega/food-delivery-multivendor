// https://github.com/expo/expo/issues/10756
// https://github.com/expo/expo/issues/5487
// https://forums.expo.dev/t/location-getcurrentpositionasync-takes-10-seconds/19714/2

import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEffect } from 'react'

/* issue we're facing on some iOS devices that getCurrentPositionAsync is slow, an alternate to that is
using watchPositionAsync to get updated location in background. */


/* this hook will keep updated location of user at all times in async storage and instead of 
using getCurrentPositionAsync we'll use location from async storage */

export const LOCATION_STORAGE_KEY = 'lastKnownLocation'
const LOCATION_UPDATES_DISTANCE = 100 // meters

const useWatchLocation = () => {
    const [permission, requestPermission] = Location.useForegroundPermissions();
    const watchPositionCallback = async ({ coords }) => {
        await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ ...coords }))
    }

    useEffect(() => {
        requestPermission()
    }, [])

    useEffect(() => {
        if (permission && !permission.granted) return;
        let locationSubscription = null;
        (async () => {
            locationSubscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                distanceInterval: LOCATION_UPDATES_DISTANCE
            },
                watchPositionCallback)
        })();
        return () => locationSubscription && locationSubscription.remove()
    }, [permission])
}

export const getLocationFromStorage = async () => {
    const locationStr = await AsyncStorage.getItem(LOCATION_STORAGE_KEY)
    if (!locationStr) return null;
    const location = JSON.parse(locationStr)
    return location
}

export default useWatchLocation