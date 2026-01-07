import { gql, useMutation, useQuery } from '@apollo/client'
import { GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR } from '../../apollo/queries'
import { useTranslation } from 'react-i18next'
import { useCallback, useContext, useMemo, useRef } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import UserContext from '../../../context/User'
import CustomHomeIcon from '../../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../../assets/SVG/imageComponents/CustomApartmentIcon'
import CustomOtherIcon from '../../../assets/SVG/imageComponents/CustomOtherIcon'
import { LocationContext } from '../../../context/Location'
import { selectAddress } from '../../../apollo/mutations'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

const useHome = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])
  const modalRef = useRef()
  const { isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)

  const { loading, data, error } = useQuery(GET_RESTAURANT_CATEGORIES_SINGLE_VENDOR)
  const [mutate] = useMutation(SELECT_ADDRESS, {
    onError
  })

  function onError(error) {
    console.log(error)
  }

  const setAddressLocation = async (address) => {
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

  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
    Other: CustomOtherIcon
  }

const onOpen = useCallback(() => {
  console.log("open")
  if (modalRef.current) {
    modalRef.current.open()
  }
}, [])

  return {
    loading,
    data,
    error,
    t,
    currentTheme,
    isLoggedIn,
    profile,
    addressIcons,
    location,
    setLocation,
    setAddressLocation,
    modalRef,
    onOpen
  }
}

export default useHome
