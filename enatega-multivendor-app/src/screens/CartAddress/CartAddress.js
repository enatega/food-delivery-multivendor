import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { Feather } from '@expo/vector-icons'
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
import { LocationContext } from '../../context/Location'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import {
  BottomAction,
  PrimaryButton,
  ScreenHeader,
  useMultivendorTheme
} from '../../ui/designSystem'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`

function CartAddresses(props) {
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const { location, setLocation } = useContext(LocationContext)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }
  const [mutate] = useMutation(SELECT_ADDRESS, { onError })
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerShown: false
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
        setTempSelectedAddress(lastSavedAddress)
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
  }

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  const addAddress = () => {
    props.navigation.navigate('AddNewAddress', {
      longitude: +location.longitude,
      latitude: +location.latitude,
      prevScreen: 'CartAddress'
    })
  }

  const confirmAddress = () => {
    if (!tempSelectedAddress) return

    setLocation({
      _id: tempSelectedAddress._id,
      label: tempSelectedAddress.label,
      latitude: Number(tempSelectedAddress.location.coordinates[1]),
      longitude: Number(tempSelectedAddress.location.coordinates[0]),
      deliveryAddress: tempSelectedAddress.deliveryAddress,
      details: tempSelectedAddress.details
    })
    mutate({ variables: { id: tempSelectedAddress._id } })
    props.navigation.navigate('Checkout', {
      longitude: +location.longitude,
      latitude: +location.latitude,
      prevScreen: 'CartAddress'
    })
  }

  return (
    <View style={styles(currentTheme).screen}>
      <ScreenHeader title={t('cartAddresses')} border />

      <FlatList
        data={profile?.addresses?.slice().reverse()}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles(currentTheme).listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: address }) => {
          const isSelected = address._id === (
            tempSelectedAddress ? tempSelectedAddress._id : location._id
          )

          return (
            <TouchableOpacity
              activeOpacity={0.72}
              style={[
                styles(currentTheme).addressRow,
                isSelected && styles(currentTheme).selectedAddressRow
              ]}
              onPress={() => onSelectAddress(address)}
            >
              <View style={styles(currentTheme).selectionColumn}>
                <RadioButton
                  size={scale(11)}
                  outerColor={currentTheme.colors.borderStandard}
                  innerColor={currentTheme.colors.accent}
                  animation='bounceIn'
                  isSelected={isSelected}
                  onPress={() => onSelectAddress(address)}
                />
              </View>

              <View style={styles(currentTheme).addressCopy}>
                <View style={styles(currentTheme).addressTitleRow}>
                  <TextDefault
                    textColor={currentTheme.colors.textPrimary}
                    style={styles(currentTheme).addressTitle}
                    bold
                    isRTL
                  >
                    {t(address.label)}
                  </TextDefault>

                  <TouchableOpacity
                    accessibilityRole='button'
                    accessibilityLabel={t('edit')}
                    activeOpacity={0.65}
                    hitSlop={8}
                    style={styles(currentTheme).editButton}
                    onPress={() => {
                      const [longitude, latitude] = address.location.coordinates
                      props.navigation.navigate('AddNewAddress', {
                        longitude: +longitude,
                        latitude: +latitude,
                        prevScreen: 'CartAddress'
                      })
                    }}
                  >
                    <Feather
                      name='edit-2'
                      size={scale(15)}
                      color={currentTheme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <TextDefault
                  line={3}
                  textColor={currentTheme.colors.textSecondary}
                  style={styles(currentTheme).addressDetail}
                  isRTL
                >
                  {address.deliveryAddress}
                </TextDefault>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <BottomAction style={styles(currentTheme).bottomAction}>
        <View style={styles(currentTheme).actionRow}>
          <PrimaryButton
            label={t('addAddress')}
            variant='secondary'
            onPress={addAddress}
            style={styles(currentTheme).secondaryAction}
            icon={(
              <Feather
                name='plus'
                size={scale(17)}
                color={currentTheme.colors.textPrimary}
              />
            )}
          />
          <PrimaryButton
            label={t('Done')}
            onPress={confirmAddress}
            disabled={!tempSelectedAddress}
            style={styles(currentTheme).primaryAction}
          />
        </View>
      </BottomAction>
    </View>
  )
}

export default CartAddresses
