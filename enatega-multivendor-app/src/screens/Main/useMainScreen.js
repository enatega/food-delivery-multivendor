import { useRef, useContext, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'
import { restaurantList } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { LocationContext } from '../../context/Location'

const RESTAURANTS = gql`
  ${restaurantList}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`

export default function useMainScreen() {
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()

  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null,
        ip: null
      },
      fetchPolicy: 'network-only'
    }
  )
  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  function onError(error) {
    console.log(error)
  }

  const addressIcons = {
    Home: 'home',
    Work: 'briefcase',
    Other: 'location-pin'
  }

  const setAddressLocation = async address => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    mutate({ variables: { id: address._id } })
    modalRef.current.close()
  }

  const setCurrentLocation = async() => {
    setBusy(true)
    const { error, coords } = await getCurrentLocation()
    if (error) navigation.navigate('SelectLocation')
    else {
      modalRef.current.close()
      setLocation({
        label: 'Current Location',
        latitude: coords.latitude,
        longitude: coords.longitude,
        deliveryAddress: 'Current Location'
      })
    }
    setBusy(false)
  }
  return {
    busy,
    loadingOrders,
    isLoggedIn,
    profile,
    search,
    setSearch,
    currentTheme,
    themeContext,
    data,
    refetch,
    networkStatus,
    loading,
    error,
    mutationLoading,
    onOpen,
    addressIcons,
    setAddressLocation,
    setCurrentLocation,
    location,
    modalRef
  }
}
