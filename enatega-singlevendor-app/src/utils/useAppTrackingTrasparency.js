import {
  requestTrackingPermissionsAsync,
  getTrackingPermissionsAsync
} from 'expo-tracking-transparency'

export const requestTrackingPermissions = async() => {
  const { status } = await requestTrackingPermissionsAsync()
  return status
}
export const getTrackingPermissions = async() => {
  const { status } = await getTrackingPermissionsAsync()
  return status
}
