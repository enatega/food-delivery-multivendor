import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EvilIcons, MaterialIcons } from '@expo/vector-icons'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { scale } from '../../utils/scaling'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { selectAddress } from '../../apollo/mutations'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { LocationContext } from '../../context/Location'
import { HeaderBackButton } from '@react-navigation/elements'
import analytics from '../../utils/analytics'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function CartAddresses(props) {
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const inset = useSafeAreaInsets()
  const { location, setLocation } = useContext(LocationContext)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [mutate] = useMutation(SELECT_ADDRESS, { onError })
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null)
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [isAddressChanged, setIsAddressChanged] = useState(false)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: t('cartAddresses'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={30} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CARTADDRESS)
    }
    Track()
  }, [])

  useEffect(() => {
    if (profile?.addresses) {
      // Find the last saved address
      const lastSavedAddress = profile?.addresses?.slice().reverse().find(address => address.selected)
      if (lastSavedAddress) {
        setSelectedAddress(lastSavedAddress)
        setTempSelectedAddress(lastSavedAddress)
        setDefaultAddress(lastSavedAddress)
        setLocation({
          _id: lastSavedAddress._id,
          label: lastSavedAddress.label,
          latitude: Number(lastSavedAddress.location.coordinates[1]),
          longitude: Number(lastSavedAddress.location.coordinates[0]),
          deliveryAddress: lastSavedAddress.deliveryAddress,
          details: lastSavedAddress.details
        })
      }
    }
  }, [profile, setLocation])

  function onError(error) {
    console.log(error)
  }

  const onSelectAddress = address => {
    setTempSelectedAddress(address)
    setIsAddressChanged(defaultAddress ? address._id !== defaultAddress._id : true)
  }

  const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();
  if (!connect) return <ErrorView refetchFunctions={[]} />
  
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).cartAddress]}>
        <FlatList
          data={profile?.addresses?.slice().reverse()}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View />}
          ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
          renderItem={({ item: address }) => (
            <View style={{ ...alignment.MBsmall }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles(currentTheme).containerSpace]}
                onPress={() => {
                  onSelectAddress(address)
                }}
              >
                <View style={styles().width100}>
                  <View style={[styles(currentTheme).titleAddress, styles().width100]}>
                    <View style={[styles().homeIcon]}>
                      <RadioButton
                        size={13}
                        outerColor={currentTheme.darkBgFont}
                        innerColor={currentTheme.radioColor}
                        animation={'bounceIn'}
                        isSelected={address._id === (tempSelectedAddress ? tempSelectedAddress._id : location._id)}
                        onPress={() => {
                          onSelectAddress(address)
                        }}
                      />
                    </View>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '70%', textAlign: currentTheme?.isRTL ? 'right' : 'left' }}
                      H5
                      bold
                      isRTL
                    >
                      {t(address.label)}
                    </TextDefault>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles().width10}
                      onPress={() => {
                        const [longitude, latitude] =
                          address.location.coordinates
                        props.navigation.navigate('AddNewAddress', {
                          longitude: +longitude,
                          latitude: +latitude,
                          prevScreen: 'CartAddress'
                        })
                      }}
                    >
                      <EvilIcons
                        name='pencil'
                        size={scale(25)}
                        color={currentTheme.darkBgFont}
                        style={styles().width100}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ ...alignment.MTxSmall }}></View>
                  <View style={styles().addressDetail}>
                    <TextDefault
                      line={4}
                      textColor={currentTheme.fontSecondColor}
                      bold
                      isRTL
                    >
                      {address.deliveryAddress}
                    </TextDefault>
                    {/* <TextDefault
                      line={3}
                      textColor={currentTheme.fontSecondColor}
                      bold
                    >
                      {address.details}
                    </TextDefault> */}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
        <View>
          <View style={styles(currentTheme).containerButton}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles(currentTheme).addButton}
              onPress={() => {
                const latitude = location.latitude
                const longitude = location.longitude
                props.navigation.navigate('AddNewAddress', {
                  longitude: +longitude,
                  latitude: +latitude,
                  prevScreen: 'CartAddress'
                })
                setIsAddressChanged(true)
              }}
            >
              <TextDefault H5 bold>
                {t('addAddress')}
              </TextDefault>
            </TouchableOpacity>
          </View>
          {tempSelectedAddress && (
            <View style={styles(currentTheme).containerButton}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles(currentTheme).addButton}
                onPress={() => {
                  setLocation({
                    _id: tempSelectedAddress._id,
                    label: tempSelectedAddress.label,
                    latitude: Number(tempSelectedAddress.location.coordinates[1]),
                    longitude: Number(tempSelectedAddress.location.coordinates[0]),
                    deliveryAddress: tempSelectedAddress.deliveryAddress,
                    details: tempSelectedAddress.details
                  })
                  mutate({ variables: { id: tempSelectedAddress._id } })
                  setSelectedAddress(tempSelectedAddress)
                  props.navigation.navigate('Checkout', {
                    longitude: +location.longitude,
                    latitude: +location.latitude,
                    prevScreen: 'CartAddress'
                  })
                }}
              >
                <TextDefault H5 bold>
                  {t('Done')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  )
}

export default CartAddresses