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
import i18n from '../../../i18n'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { LocationContext } from '../../context/Location'
import Analytics from '../../utils/analytics'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function CartAddresses(props) {
  const inset = useSafeAreaInsets()
  const { location, setLocation } = useContext(LocationContext)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const [mutate] = useMutation(SELECT_ADDRESS, { onError })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: i18n.t('myAddresses')
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
          <View style={styles().width100}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles().width100}
              onPress={() => {
                props.navigation.navigate('NewAddress', { location })
              }}>
              <View style={styles().width100}>
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
                      SAVE
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
          <View style={styles().line} />
        </View>
      )}
      <FlatList
        style={{ backgroundColor: currentTheme.themeBackground }}
        data={profile.addresses}
        keyExtractor={item => item._id}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={styles().line} />}
        ListHeaderComponent={() => <View style={{ ...alignment.MTmedium }} />}
        renderItem={({ item: address }) => (
          <View style={styles().width100}>
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
                      outerColor={currentTheme.radioOuterColor}
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
                    style={{ width: '70%' }}
                    H5
                    bold>
                    {address.label}
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
