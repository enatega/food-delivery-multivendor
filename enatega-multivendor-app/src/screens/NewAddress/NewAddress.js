import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useLayoutEffect
} from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import i18n from '../../../i18n'
import styles from './styles'
import { OutlinedTextField } from 'react-native-material-textfield'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import gql from 'graphql-tag'
import { scale } from '../../utils/scaling'
import { createAddress } from '../../apollo/mutations'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'
import { LocationContext } from '../../context/Location'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import SearchModal from '../../components/Address/SearchModal'
import AddressText from '../../components/Address/AddressText'
import Analytics from '../../utils/analytics'
const CREATE_ADDRESS = gql`
  ${createAddress}
`

const labelValues = [
  {
    title: 'Home',
    value: 'Home'
  },
  {
    title: 'Work',
    value: 'Work'
  },
  {
    title: 'Other',
    value: 'Other'
  }
]

const LATITUDE = 33.7001019
const LONGITUDE = 72.9735978
const LATITUDE_DELTA = 0.0022
const LONGITUDE_DELTA = 0.0021

function NewAddress(props) {
  const addressRef = useRef()
  const inset = useSafeAreaInsets()
  const [modalVisible, setModalVisible] = useState(false)
  const location = props.route.params ? props.route.params.location : null
  const { setLocation } = useContext(LocationContext)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDetails, setDeliveryDetails] = useState('')
  const [deliveryAddressError, setDeliveryAddressError] = useState('')
  const [deliveryDetailsError, setDeliveryDetailsError] = useState('')
  const [selectedLabel, setSelectedLabel] = useState(labelValues[0].value)
  const [region, setRegion] = useState({
    latitude: location ? location.latitude : LATITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitude: location ? location.longitude : LONGITUDE,
    longitudeDelta: LONGITUDE_DELTA
  })

  const regionObj = props.route.params ? props.route.params.regionChange : null
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_NEWADDRESS)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: i18n.t('addAddress')
    })
  }, [props.navigation])

  useEffect(() => {
    if (!regionObj) return regionChange(region)
    regionChange(regionObj)
  }, [regionObj])

  const [mutate, { loading }] = useMutation(CREATE_ADDRESS, {
    onCompleted,
    onError
  })

  function regionChange(region) {
    Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude
    })
      .then(data => {
        if (data.length) {
          const location = data[0]
          const deliveryAddress = Object.keys(location)
            .map(key => location[key])
            .join(' ')
          setDeliveryAddress(deliveryAddress)
          setRegion(region)
          addressRef.current.setValue(deliveryAddress)
        } else console.log('location not recognized')
      })
      .catch(error => {
        console.log('Error : regionChange', error)
      })
  }

  function onCompleted(data) {
    FlashMessage({
      message: 'Address added'
    })
    const address = data.createAddress.addresses.find(a => a.selected)
    const cartAddress = props.route.params?.backScreen || null
    setLocation({
      ...address,
      latitude: parseFloat(address.location.coordinates[1]),
      longitude: parseFloat(address.location.coordinates[0])
    })
    if (cartAddress === 'Cart') {
      props.navigation.navigate('Cart')
    } else props.navigation.goBack()
  }

  function onError(error) {
    console.log(error)
    FlashMessage({
      message: `An error occured. Please try again. ${error}`
    })
  }

  const onOpen = () => {
    setModalVisible(true)
  }
  const onClose = () => {
    setModalVisible(false)
  }

  const onSubmit = (deliveryAddressGeo, coordinates) => {
    setDeliveryAddress(deliveryAddressGeo)
    addressRef.current.setValue(deliveryAddressGeo)
    setRegion({
      ...region,
      longitude: coordinates.lng,
      latitude: coordinates.lat
    })
    setModalVisible(false)
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
        style={styles().flex}
        enabled={!modalVisible}>
        <View style={styles().flex}>
          <View style={styles().mapContainer}>
            <MapView
              style={styles().flex}
              scrollEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}
              rotateEnabled={false}
              cacheEnabled={true}
              showsUserLocation={false}
              customMapStyle={
                themeContext.ThemeValue === 'Dark' ? mapStyle : null
              }
              initialRegion={{
                latitude: LATITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitude: LONGITUDE,
                longitudeDelta: LONGITUDE_DELTA
              }}
              region={region}
              provider={PROVIDER_GOOGLE}
              onPress={() => {
                props.navigation.navigate('FullMap', {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  currentScreen: 'NewAddress'
                })
              }}></MapView>
            <View
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 1,
                translateX: -25,
                translateY: -25,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ translateX: -25 }, { translateY: -25 }]
              }}>
              <CustomMarker
                width={40}
                height={40}
                transform={[{ translateY: -20 }]}
                translateY={-20}
              />
            </View>
          </View>

          <ScrollView
            style={styles().flex}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <View style={styles(currentTheme).subContainer}>
              <View style={styles().upperContainer}>
                <View style={styles().addressContainer}>
                  <View style={styles().geoLocation}>
                    <View style={{ width: '90%' }}>
                      <OutlinedTextField
                        error={deliveryAddressError}
                        ref={addressRef}
                        value={deliveryAddress}
                        label={i18n.t('fullDeliveryAddress')}
                        labelFontSize={scale(8)}
                        fontSize={scale(10)}
                        lineWidth={StyleSheet.hairlineWidth}
                        activeLineWidth={StyleSheet.hairlineWidth}
                        maxLength={100}
                        textColor={currentTheme.fontMainColor}
                        baseColor={currentTheme.fontSecondColor}
                        errorColor={currentTheme.textErrorColor}
                        tintColor={
                          !deliveryAddressError
                            ? currentTheme.fontMainColor
                            : 'red'
                        }
                        labelTextStyle={{
                          ...textStyles.Normal,
                          paddingTop: scale(1)
                        }}
                        onChangeText={text => {
                          setDeliveryAddress(text)
                        }}
                        onBlur={() => {
                          setDeliveryAddressError(
                            !deliveryAddress.trim().length
                              ? 'Delivery address is required'
                              : null
                          )
                        }}
                      />
                    </View>
                    <AddressText
                      deliveryAddress={deliveryAddress}
                      onPress={onOpen}
                    />
                  </View>
                  <View style={{ ...alignment.MTsmall }}></View>
                  <OutlinedTextField
                    error={deliveryDetailsError}
                    value={deliveryDetails}
                    label={i18n.t('deliveryDetails')}
                    labelFontSize={scale(8)}
                    fontSize={scale(10)}
                    textAlignVertical="top"
                    multiline={false}
                    lineWidth={StyleSheet.hairlineWidth}
                    activeLineWidth={StyleSheet.hairlineWidth}
                    maxLength={30}
                    textColor={currentTheme.fontMainColor}
                    baseColor={currentTheme.fontSecondColor}
                    errorColor={currentTheme.textErrorColor}
                    tintColor={
                      !deliveryDetailsError ? currentTheme.fontMainColor : 'red'
                    }
                    labelTextStyle={{
                      ...textStyles.Normal,
                      paddingTop: scale(1)
                    }}
                    onChangeText={text => {
                      setDeliveryDetails(text)
                    }}
                    onBlur={() => {
                      setDeliveryDetailsError(
                        !deliveryDetails.trim().length
                          ? 'Delivery details is required'
                          : null
                      )
                    }}
                  />
                </View>
                <View style={styles().labelButtonContainer}>
                  <View style={styles().labelTitleContainer}>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      B700
                      bolder>
                      Label as
                    </TextDefault>
                  </View>
                  <View style={styles().buttonInline}>
                    {labelValues.map((label, index) => (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        key={index}
                        style={
                          selectedLabel === label.value
                            ? styles(currentTheme).activeLabel
                            : styles(currentTheme).labelButton
                        }
                        onPress={() => {
                          setSelectedLabel(label.value)
                        }}>
                        <TextDefault
                          style={
                            selectedLabel === label.value && {
                              ...textStyles.Bolder
                            }
                          }
                          textColor={
                            selectedLabel === label.value
                              ? currentTheme.tagColor
                              : currentTheme.fontSecondColor
                          }
                          small
                          center>
                          {label.title}
                        </TextDefault>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  const deliveryAddressError = !deliveryAddress.trim().length
                    ? 'Delivery address is required'
                    : null
                  const deliveryDetailsError = !deliveryDetails.trim().length
                    ? 'Delivery details is required'
                    : null

                  setDeliveryAddressError(deliveryAddressError)
                  setDeliveryDetailsError(deliveryDetailsError)

                  if (
                    deliveryAddressError === null &&
                    deliveryDetailsError === null
                  ) {
                    mutate({
                      variables: {
                        addressInput: {
                          latitude: `${region.latitude}`,
                          longitude: `${region.longitude}`,
                          deliveryAddress: deliveryAddress.trim(),
                          details: deliveryDetails.trim(),
                          label: selectedLabel
                        }
                      }
                    })
                  }
                }}
                activeOpacity={0.5}
                style={styles(currentTheme).saveBtnContainer}>
                <TextDefault textColor={currentTheme.buttonText} H4 bold>
                  {i18n.t('saveContBtn')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
      <SearchModal
        visible={modalVisible}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default NewAddress
