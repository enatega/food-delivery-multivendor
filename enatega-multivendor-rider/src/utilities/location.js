import * as TaskManager from 'expo-task-manager'
import { clientRef } from '../apollo/index'
import { updateLocation } from '../apollo/mutations'
import { gql } from '@apollo/client'
const UPDATE_LOCATION = gql`
  ${updateLocation}
`

TaskManager.defineTask(
  'RIDER_LOCATION',
  async({ data: { locations }, error }) => {
    try {
      if (error) {
        return
      }
      if (locations.length > 0) {
        const {
          coords: { latitude, longitude }
        } = locations[locations.length - 1]
        await clientRef.mutate({
          mutation: UPDATE_LOCATION,
          variables: {
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }
)
