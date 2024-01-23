import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/auth'
import { gql, useMutation } from '@apollo/client'
import { toggleAvailablity } from '../../apollo/mutations'
import UserContext from '../../context/user'
import { profile } from '../../apollo/queries'
import { useTranslation } from 'react-i18next'

const TOGGLE_RIDER = gql`
  ${toggleAvailablity}
`
const PROFILE = gql`
  ${profile}
`

const PRODUCT_URL = 'https://enatega.com/enatega-multi-vendor/'
const PRIVACY_URL = 'https://enatega.com/privacy-policy/'

const ABOUT_URL = 'https://ninjascode.com/'

// constants
/*const datas = [
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
]*/

const useSidebar = () => {
  const { t } = useTranslation()
  const datas = [
    {
      title: t('productPage'),
      icon: 'product-hunt',
      navigateTo: PRODUCT_URL
    },
    {
      title: t('privacyPolicy'),
      icon: 'lock',
      navigateTo: PRIVACY_URL
    },
    {
      title: t('aboutUs'),
      icon: 'info-circle',
      navigateTo: ABOUT_URL
    }
  ]
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
