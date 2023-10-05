import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/auth'
import { gql, useMutation } from '@apollo/client'
import { toggleAvailablity } from '../../apollo/mutations'
import UserContext from '../../context/user'
import { profile } from '../../apollo/queries'

const TOGGLE_RIDER = gql`
  ${toggleAvailablity}
`
const PROFILE = gql`
  ${profile}
`

const PRODUCT_URL =
  'https://enatega.com/enatega-multivendor-open-source-food-delivery-solution/'
const PRIVACY_URL =
  'https://multivendor.enatega.com/?_gl=1*gjjx59*_ga*NTczMDY0NDU1LjE2ODUzMzgzODg.*_ga_DTSL4MVB5L*MTY5NjQ4MDQ3Ni41NC4xLjE2OTY0ODA0ODMuNTMuMC4w&_ga=2.17598781.520939582.1696480479-573064455.1685338388#/privacy'

const ABOUT_URL = 'https://ninjascode.com/'

// constants
const datas = [
  {
    title: 'Product Page',
    icon: 'product-hunt',
    navigateTo: PRODUCT_URL
  },
  {
    title: 'Privacy Policy',
    icon: 'lock',
    navigateTo: PRIVACY_URL
  },
  {
    title: 'About Us',
    icon: 'info-circle',
    navigateTo: ABOUT_URL
  }
]

const useSidebar = () => {
  const { logout } = useContext(AuthContext)
  const { dataProfile } = useContext(UserContext)
  const [isEnabled, setIsEnabled] = useState(dataProfile?.rider.available)

  const toggleSwitch = () => {
    mutateToggle({ variables: { id: dataProfile.rider._id }, onCompleted })
    setIsEnabled(previousState => !previousState)
  }

  useEffect(() => {
    if (!dataProfile) return
    setIsEnabled(dataProfile?.rider.available)
  }, [dataProfile])

  function onCompleted({ toggleAvailability }) {
    if (toggleAvailability) {
      setIsEnabled(toggleAvailability.available)
    }
  }
  const [mutateToggle] = useMutation(TOGGLE_RIDER, {
    refetchQueries: [{ query: PROFILE }]
  })
  return {
    logout,
    isEnabled,
    toggleSwitch,
    datas,
    dataProfile
  }
}

export default useSidebar
