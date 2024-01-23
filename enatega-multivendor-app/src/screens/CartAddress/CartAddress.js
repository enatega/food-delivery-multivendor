import React, { useContext, useEffect, useLayoutEffect } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EvilIcons } from '@expo/vector-icons'
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
import { Entypo } from '@expo/vector-icons'
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
  console.log('profile', profile)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: t('myAddresses'),
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        borderColor: currentTheme.white,
        borderWidth: 1
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                width: 55,
                alignItems: 'center'
              }}>
              <Entypo name="cross" size={30} color="black" />
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
      {!location._id && (
        <View
          style={{
            backgroundColor: currentTheme.themeBackground,
            ...alignment.PTlarge
          }}>
          <View style={styles(currentTheme).addressContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).addressContainer}
              onPress={() => {
                props.navigation.navigate('NewAddress', { location })
              }}>
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
                    bold>
                    {location.label}
                  </TextDefault>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles().width10}
                    onPress={() =>
                      props.navigation.navigate('NewAddress', { location })
                    }>
                    <TextDefault
                      textColor={currentTheme.iconColorPink}
                      small
                      bolder>
                      {t('save')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
                <View style={{ ...alignment.MTxSmall }}></View>
                <View style={[styles().addressDetail]}>
                  <TextDefault
                    line={4}
                    textColor={currentTheme.fontSecondColor}
                    bold>
                    {location.deliveryAddress}
                  </TextDefault>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList
        style={{ backgroundColor: currentTheme.themeBackground }}
        data={profile?.addresses}
        keyExtractor={item => item._id}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => (
          <View style={{ ...alignment.MBmedium }} />
        )}
        ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
        renderItem={({ item: address }) => (
          <View style={styles(currentTheme).addressContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().width100}
              onPress={() => {
                onSelectAddress(address)
              }}>
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
                    bold>
                    {t(address.label)}
                  </TextDefault>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles().width10}
                    onPress={() =>
                      props.navigation.navigate('EditAddress', {
                        ...address
                      })
                    }>
                    <EvilIcons
                      name="pencil"
                      size={scale(25)}
                      color={currentTheme.iconColorPink}
                      style={styles().width100}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ ...alignment.MTxSmall }}></View>
                <View style={styles().addressDetail}>
                  <TextDefault
                    line={4}
                    textColor={currentTheme.fontSecondColor}
                    bold>
                    {address.deliveryAddress}
                  </TextDefault>
                  <TextDefault
                    line={3}
                    textColor={currentTheme.fontSecondColor}
                    bold>
                    {address.details}
                  </TextDefault>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default CartAddresses
