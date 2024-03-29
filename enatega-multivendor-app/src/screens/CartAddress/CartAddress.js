import React, { useContext, useEffect, useLayoutEffect } from 'react'
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

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function CartAddresses(props) {
  const Analytics = analytics()

  const inset = useSafeAreaInsets()
  const { location, setLocation } = useContext(LocationContext)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const [mutate] = useMutation(SELECT_ADDRESS, { onError })

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
  function onError(error) {
    console.log(error)
  }

  const onSelectAddress = address => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    mutate({ variables: { id: address._id } })
    props.navigation.goBack()
  }

  return (
    <>
      <View style={[styles().flex, styles(currentTheme).cartAddress]}>
        {!location._id && (
          <View
            style={{
              backgroundColor: currentTheme.themeBackground
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles(currentTheme).containerSpace]}
              onPress={() => {
                const latitude = location.latitude
                const longitude = location.longitude
                props.navigation.navigate('AddNewAddress', {
                  longitude: +longitude,
                  latitude: +latitude
                })
              }}
            >
              <View style={styles(currentTheme).width100}>
                <View style={[styles().titleAddress, styles().width100]}>
                  <View style={[styles().homeIcon]}>
                    <RadioButton
                      size={13}
                      outerColor={currentTheme.radioOuterColor}
                      innerColor={currentTheme.radioColor}
                      animation={'bounceIn'}
                      isSelected={true}
                    />
                  </View>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    style={{ width: '70%' }}
                    H5
                    bold
                    left
                  >
                    {t(location.label)}
                  </TextDefault>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles().width10}
                    onPress={() =>{
                        const latitude = location.latitude
                        const longitude = location.longitude
                        props.navigation.navigate('AddNewAddress', {
                          longitude: +longitude,
                          latitude: +latitude
                        })
                      }
                    }
                  >
                    <TextDefault
                      textColor={currentTheme.darkBgFont}
                      small
                      bolder
                    >
                      {t('save')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
                <View style={{ ...alignment.MTxSmall }}></View>
                <View style={[styles().addressDetail]}>
                  <TextDefault
                    line={4}
                    textColor={currentTheme.fontSecondColor}
                    bold
                  >
                    {location.deliveryAddress}
                  </TextDefault>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={profile?.addresses}
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
                  <View style={[styles().titleAddress, styles().width100]}>
                    <View style={[styles().homeIcon]}>
                      <RadioButton
                        size={13}
                        outerColor={currentTheme.darkBgFont}
                        innerColor={currentTheme.radioColor}
                        animation={'bounceIn'}
                        isSelected={address._id === location._id}
                        onPress={() => {
                          onSelectAddress(address)
                        }}
                      />
                    </View>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '70%', textAlign: 'left' }}
                      H5
                      bold
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
                    >
                      {address.deliveryAddress}
                    </TextDefault>
                    <TextDefault
                      line={3}
                      textColor={currentTheme.fontSecondColor}
                      bold
                    >
                      {address.details}
                    </TextDefault>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  )
}

export default CartAddresses
