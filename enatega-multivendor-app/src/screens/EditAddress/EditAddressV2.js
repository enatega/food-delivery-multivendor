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
  Image
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styles from './styles'
import { OutlinedTextField, TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
import gql from 'graphql-tag'
import { editAddress } from '../../apollo/mutations'
import * as Location from 'expo-location'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { LocationContext } from '../../context/Location'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import AddressText from '../../components/Address/AddressText'
import SearchModal from '../../components/Address/SearchModal'
import Analytics from '../../utils/analytics'
import { MaterialIcons, Entypo, Foundation } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'

const EDIT_ADDRESS = gql`
  ${editAddress}
`

const labelValues = [
  {
    title: 'Home',
    value: 'Home',
    icon: <Entypo name="home" size={24} />
  },
  {
    title: 'Work',
    value: 'Work',
    icon: <MaterialIcons name="work" size={24} />
  },
  {
    title: 'Other',
    value: 'Other',
    icon: <Foundation name="heart" size={24} />
  }
]

const LATITUDE_DELTA = 0.0022
const LONGITUDE_DELTA = 0.0021

function EditAddress(props) {
  const analytics = Analytics()

  const { t } = useTranslation()
  const addressRef = useRef(null)
  const { location, setLocation } = useContext(LocationContext)
  const [_id] = useState(props?.route.params._id ?? null)
  const [selectedLabel, setSelectedLabel] = useState(
    props?.route.params.label ?? labelValues[0].value
  )
  const [region, setRegion] = useState({
    latitude: props?.route.params.location
      ? parseFloat(props?.route.params.location.coordinates[1] ?? null)
      : props?.route.params.regionChange.latitude,
    latitudeDelta: LATITUDE_DELTA,
    longitude: props?.route.params.location
      ? parseFloat(props?.route.params.location.coordinates[0] ?? '')
      : props?.route.params.regionChange.longitude,
    longitudeDelta: LONGITUDE_DELTA
  })
  const [deliveryAddress, setDeliveryAddress] = useState(
    props?.route.params.deliveryAddress ?? ''
  )
  const [deliveryDetails, setDeliveryDetails] = useState(
    props?.route.params.details ?? ''
  )
  const [deliveryAddressError, setDeliveryAddressError] = useState('')
  const [deliveryDetailsError, setDeliveryDetailsError] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const regionObj = props?.route.params.regionChange ?? null

  const [mutate, { loading }] = useMutation(EDIT_ADDRESS, {
    onCompleted,
    onError
  })
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const inset = useSafeAreaInsets()

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: t('editAddress'),
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
      },
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        borderWidth: 1,
        borderColor: currentTheme.white,

        marginLeft: 0
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
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation])
  useEffect(() => {
    if (regionObj !== null) regionChange(regionObj)
  }, [regionObj])
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_EDITADDRESS)
    }
    Track()
  }, [])
  function regionChange(region) {
    Location.reverseGeocodeAsync({ ...region })
      .then(data => {
        if (data.length) {
          const location = data[0]
          const deliveryAddress = Object.keys(location)
            .map(key => location[key])
            .join(' ')
          setDeliveryAddress(deliveryAddress)
          addressRef.current.setValue(deliveryAddress)
        }
      })
      .catch(error => {
        console.log(error)
      })
    setRegion(region)
  }

  function onCompleted({ editAddress }) {
    if (location._id === editAddress._id) {
      setLocation({
        ...editAddress,
        latitude: parseFloat(editAddress.latitude),
        longitude: parseFloat(editAddress.longitude)
      })
    }
    FlashMessage({
      message: t('addressUpdated')
    })
    // show message here
    props?.navigation.goBack()
  }

  function onError(error) {
    FlashMessage({
      message: `${t('errorOccured')} ${error}`
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
        style={styles(currentTheme).flex}
        enabled={!modalVisible}>
        <View style={styles(currentTheme).flex}>
          <View style={styles().mapContainer}>
            <MapView
              style={{ flex: 1 }}
              scrollEnabled={false}
              zoomEnabled={false}
              zoomControlEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              showsCompass={false}
              showsIndoors={false}
              rotateEnabled={false}
              showsUserLocation={false}
              followsUserLocation={false}
              showsMyLocationButton={false}
              showsPointsOfInterest={false}
              cacheEnabled={true}
              loadingEnabled={true}
              loadingIndicatorColor={currentTheme.iconColorPink}
              region={region}
              customMapStyle={mapStyle}
              provider={PROVIDER_DEFAULT}
              onPress={() => {
                props?.navigation.navigate('FullMap', {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  currentScreen: 'EditAddress'
                })
              }}></MapView>
            <View style={styles().editAddressImageContainer}>
              <Image
                source={require('../../assets/images/user.png')}
                width={20}
              />
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            <View style={styles(currentTheme).subContainer}>
              <View style={styles().upperContainer}>
                <View style={styles().addressContainer}>
                  <View style={styles(currentTheme).geoLocation}>
                    <View style={{ width: '100%' }}>
                      <OutlinedTextField
                        placeholder={t('deliveryAddress')}
                        error={deliveryAddressError}
                        ref={addressRef}
                        value={deliveryAddress}
                        label={t('fullDeliveryAddress')}
                        labelFontSize={scale(12)}
                        fontSize={scale(12)}
                        renderRightAccessory={() => (
                          <TouchableOpacity onPress={onOpen}>
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={currentTheme.darkBgFont}
                            />
                          </TouchableOpacity>
                        )}
                        maxLength={100}
                        backgroundColor={currentTheme.black}
                        textColor={currentTheme.fontMainColor}
                        baseColor={currentTheme.darkBgFont}
                        errorColor={currentTheme.textErrorColor}
                        tintColor={
                          !deliveryAddressError ? currentTheme.tagColor : 'red'
                        }
                        labelOffset={{ y1: -5 }}
                        labelTextStyle={{
                          fontSize: scale(12),
                          paddingTop: scale(1)
                        }}
                        onChangeText={text => {
                          setDeliveryAddress(text)
                        }}
                        onBlur={() => {
                          setDeliveryAddressError(
                            !deliveryAddress.trim().length
                              ? t('DeliveryAddressIsRequired')
                              : null
                          )
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ ...alignment.MTlarge }}></View>
                  <OutlinedTextField
                    placeholder={t('aptFloor')}
                    error={deliveryDetailsError}
                    label={t('deliveryDetails')}
                    labelFontSize={scale(12)}
                    fontSize={scale(12)}
                    textAlignVertical="top"
                    multiline={false}
                    maxLength={30}
                    textColor={currentTheme.fontMainColor}
                    baseColor={currentTheme.darkBgFont}
                    errorColor={currentTheme.textErrorColor}
                    tintColor={
                      !deliveryDetailsError ? currentTheme.tagColor : 'red'
                    }
                    labelOffset={{ y1: -5 }}
                    labelTextStyle={{
                      fontSize: scale(12),
                      paddingTop: scale(1)
                    }}
                    value={deliveryDetails}
                    onChangeText={text => {
                      setDeliveryDetails(text)
                    }}
                    onBlur={() => {
                      setDeliveryDetailsError(
                        !deliveryDetails.trim().length
                          ? t('DeliveryAddressIsRequired')
                          : null
                      )
                    }}
                  />
                </View>

                <View style={styles().labelButtonContainer}>
                  <View style={styles().labelTitleContainer}>
                    <View style={styles().horizontalLine} />
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      H5
                      bolder>
                      {t('addLabel')}
                    </TextDefault>
                  </View>
                  <View style={styles().buttonInline}>
                    {labelValues.map((label, index) => (
                      <>
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
                            textColor={
                              selectedLabel === label.value
                                ? currentTheme.iconColorPink
                                : currentTheme.fontMainColor
                            }
                            bold
                            center>
                            {label.icon}
                          </TextDefault>
                        </TouchableOpacity>
                      </>
                    ))}
                  </View>

                  <View style={styles().textbuttonInline}>
                    {labelValues.map((label, index) => (
                      <>
                        <TextDefault
                          key={index}
                          style={styles().titlebuttonInline}
                          textColor={currentTheme.black}
                          bold
                          center>
                          {t(label.title)}
                        </TextDefault>
                      </>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                const deliveryAddressError = !deliveryAddress.trim().length
                  ? t('DeliveryAddressIsRequired')
                  : null
                const deliveryDetailsError = !deliveryDetails.trim().length
                  ? t('DeliveryAddressIsRequired')
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
                        _id: _id,
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
              <TextDefault textColor={currentTheme.black} H5 bold>
                {t('saveContBtn')}
              </TextDefault>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      {/* <SearchModal
        visible={modalVisible}
        onClose={onClose}
        onSubmit={onSubmit}
      /> */}
      {modalVisible ? (
        <SearchModal
          visible={modalVisible}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      ) : null}
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default EditAddress
