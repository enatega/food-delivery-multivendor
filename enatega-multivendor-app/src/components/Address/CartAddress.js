import React, { useContext, useState } from 'react'
import { TouchableOpacity, View, FlatList, Linking } from 'react-native'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { FontAwesome, Entypo } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { useMutation, gql } from '@apollo/client'
import { selectAddress } from '../../apollo/mutations'
import UserContext from '../../context/User'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useLocation } from '../../ui/hooks'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function CartAddress(props) {
  const themeContext = useContext(ThemeContext)
  const { location, setLocation } = useContext(LocationContext)
  const { getCurrentLocation, getLocationPermission } = useLocation()
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile } = useContext(UserContext)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const [mutate] = useMutation(SELECT_ADDRESS)

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
  }

  const setCurrentLocation = async() => {
    setLoading(true)
    const { status, canAskAgain } = await getLocationPermission()
    if (status !== 'granted' && !canAskAgain) {
      FlashMessage({
        message:
          'Tap on this message to open Settings then allow app to use location from permissions.',
        onPress: async() => {
          await Linking.openSettings()
        }
      })
      setLoading(false)
      return
    }
    const { error, coords, message } = await getCurrentLocation()
    if (error) {
      FlashMessage({
        message
      })
      setLoading(false)
      return
    }
    setLoading(false)
    props.navigation.navigate('SelectLocation', { ...coords })
  }

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <View style={{ width: '90%', alignSelf: 'center' }}>
        <View style={styles().headerContainer}>
          <TextDefault textColor={currentTheme?.fontMainColor}>
            Deliver to:
          </TextDefault>
          <TouchableOpacity activeOpacity={1}>
            <TextDefault
              textColor={currentTheme?.tagColor}
              numberOfLines={1}
              H5
              bolder>
              {' '}
              {location?.label}
            </TextDefault>
          </TouchableOpacity>
        </View>
        <View>
          <TextDefault textColor={currentTheme?.tagColor} numberOfLines={1} H5>
            {' '}
            {location?.deliveryAddress}
          </TextDefault>
        </View>
      </View>
      <View style={styles().fieldContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).greenBox,
            styles().current,
            { ...alignment.MBmedium }
          ]}
          onPress={() => {
            props.navigation.navigate('NewAddress', {
              backScreen: 'Cart'
            })
          }}>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Entypo name="location-pin" size={20} color="black" />
          </View>
          <TextDefault
            textColor={currentTheme?.fontMainColor}
            numberOfLines={1}
            H5
            bolder>
            {' '}
            Add new Address
          </TextDefault>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles(currentTheme).greenBox, styles().current]}
          onPress={setCurrentLocation}>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <FontAwesome name="location-arrow" size={20} color="black" />
          </View>
          <TextDefault
            textColor={currentTheme?.fontMainColor}
            numberOfLines={1}
            H5
            bolder>
            {' '}
            Use current location
          </TextDefault>
        </TouchableOpacity>
        <View style={styles(currentTheme).line} />
        <FlatList
          data={profile?.addresses}
          keyExtractor={item => item._id}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={styles().line} />}
          ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
          renderItem={({ item: address }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles(currentTheme).greenBox, styles().lowerCurrent]}
              onPress={() => {
                onSelectAddress(address)
              }}>
              <FontAwesome name="home" size={20} color="black" />
              <View style={{ width: '70%' }}>
                <TextDefault
                  textColor={currentTheme?.fontMainColor}
                  numberOfLines={1}
                  H5
                  bolder>
                  {' '}
                  {location?.label}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme?.fontMainColor}
                  numberOfLines={1}>
                  {' '}
                  {location?.deliveryAddress}
                </TextDefault>
              </View>
              <Entypo
                name="edit"
                size={20}
                color="black"
                onPress={() =>
                  props.navigation.navigate('EditAddress', {
                    ...address
                  })
                }
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}

export default CartAddress
