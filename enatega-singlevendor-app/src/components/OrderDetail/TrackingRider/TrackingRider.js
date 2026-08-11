import React, { useEffect } from 'react'
import { Marker } from 'react-native-maps'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { rider } from '../../../apollo/queries'
import { subscriptionRiderLocation } from '../../../apollo/subscriptions'
import RiderMarker from '../../../assets/SVG/rider-marker'

const RIDER = gql`
  ${rider}
`
const RIDER_LOCATION = gql`
  ${subscriptionRiderLocation}
`
const TrackingRider = ({ id }) => {
  const { loading, error, data, subscribeToMore } = useQuery(RIDER, {
    variables: { id },
    fetchPolicy: 'network-only'
  })
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: RIDER_LOCATION,
      variables: { riderId: id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          rider: {
            ...prev.rider,
            ...subscriptionData.data.subscriptionRiderLocation
          }
        }
      }
    })
    return unsubscribe
  }, [])

  if (loading) return null
  if (error) return null

  return (
    <Marker
      coordinate={{
        latitude: parseFloat(data.rider.location.coordinates[1]),
        longitude: parseFloat(data.rider.location.coordinates[0])
      }}>
      <RiderMarker />
    </Marker>
  )
}

export default TrackingRider
