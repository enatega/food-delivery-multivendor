import { useContext, useState, useEffect } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { AuthContext } from '../context'
import { restaurantInfo, toggleAvailability } from '../../apollo'
import { Alert } from 'react-native'
import { DAYS } from '../../utilities'
import usePrintOrder from './usePrintOrder'

export default function useAccount() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isToggling, setIsToggling] = useState(false); 
  const { loading, error, data, refetch, networkStatus } = useQuery(
    gql `
      ${restaurantInfo}
      `
    ,
    { fetchPolicy: 'network-only' }
  )


const [toggle, { loading: loadingToggle }] = useMutation(
    gql`${toggleAvailability}`,
    {
      onCompleted: (res) => {
        setIsAvailable(res.toggleAvailability.isAvailable)
        setIsToggling(false)
      },
      onError: () => {
        Alert.alert('Error', 'Failed to update availability. Please try again.')
        setIsToggling(false)
      }
    }
  )

  useEffect(() => {
    if (data?.restaurant) {
      setIsAvailable(data.restaurant.isAvailable)
    }
  }, [data])

  const toggleSwitch = async () => {
    if (!data?.restaurant || loadingToggle) return

    const restaurantId = data.restaurant._id
    
    // Optimistic UI update
    setIsAvailable((prev) => !prev)
    setIsToggling(true)
    try {
      await toggle({ variables: { restaurantId } })
    } catch {
      // Revert UI state if mutation fails
      setIsAvailable((prev) => !prev)
      setIsToggling(false)
    }
  }


  const isOpenTimings = () => {
    if (!data) return true
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = data.restaurant.openingTimes.find(
      o => o.day === DAYS[day]
    )
    const times = todaysTimings.times.filter(
      t =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    )

    return times.length > 0
  }

  const { logout } = useContext(AuthContext)
  const { printer, selectPrinter } = usePrintOrder()
  return {
    logout,
    loading,
    error,
    data,
    refetch,
    networkStatus,
    isAvailable,
    toggleSwitch,
    loadingToggle,
    isOpenTimings,
    printer,
    isToggling,
    selectPrinter
  }
} 