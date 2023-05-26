import React, { useEffect, useMemo, useState } from 'react'
import styles from './styles'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { MapStyles } from '../../utils/mapStyle'
import CustomerMarker from '../../assets/SVG/customer-marker'
import { Animated, Image, TouchableOpacity, View } from 'react-native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { LinearGradient } from 'expo-linear-gradient'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import CartItem from '../../components/CartItem/CartItem'
import { EvilIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import LocationMarker from '../../assets/SVG/location-marker'
import PaymentIcon from '../../assets/SVG/payment-icon'
import { calculateDistance } from '../../utils/customFunctions'
import { SHIPPING_METHOD } from '../../utils/enums'
import SearchIcon from '../../assets/SVG/search-icon'
import NavigationIcon from '../../assets/SVG/navigation-icon'
import EditPenIcon from '../../assets/SVG/edit-pen-icon'
import TrashIcon from '../../assets/SVG/trash-delete-icon'
import { MethodField } from '../PaymentMethod/PaymentMethod.components'
import VoucherCard from '../../assets/SVG/voucher-card'

export const Map = ({ location }) => (
  <MapView
    style={styles.map}
    showsUserLocation
    zoomEnabled={true}
    zoomControlEnabled={true}
    rotateEnabled={false}
    initialRegion={{
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }}
    customMapStyle={MapStyles}
    provider={PROVIDER_GOOGLE}>
    <Marker coordinate={location} title="Current Address">
      <CustomerMarker />
    </Marker>
  </MapView>
)

export const CartDetails = ({
  theme,
  orderDate,
  setOrderDate,
  onOpenShippingModal,
  cart,
  addQuantity,
  removeQuantity,
  deleteItem,
  restaurant,
  configuration,
  tipAmount,
  setTipAmount,
  user,
  location,
  shippingMethod,
  setShippingMethod,
  onOpenAddressModal,
  onSelectPaymentMethod,
  selectedPaymentMethod,
  onNavigateVoucher,
  onRemoveVoucher,
  voucher
}) => {
  const currency = configuration.currencySymbol
  const userLocation = {
    location: {
      latitude: location.latitude,
      longitude: location.longitude
    }
  }
  const subTotal = useMemo(
    () =>
      cart.reduce(
        (prev, item) => prev + item.variation.price * item.quantity,
        0
      ),
    [cart]
  )

  const deliveryFee = useMemo(() => {
    const latOrigin = Number(restaurant.location.coordinates[1])
    const lonOrigin = Number(restaurant.location.coordinates[0])
    const latDest = Number(userLocation.latitude)
    const longDest = Number(userLocation.longitude)
    const distance = calculateDistance(latOrigin, lonOrigin, latDest, longDest)
    const amount = Math.ceil(distance) * configuration.deliveryRate
    return amount > 0 ? amount : configuration.deliveryRate
  }, [restaurant, userLocation, configuration.deliveryRate])

  const taxCharges = useMemo(() => {
    if (restaurant.tax === 0) {
      return restaurant.tax
    }
    const delivery = shippingMethod === SHIPPING_METHOD.PICKUP ? 0 : deliveryFee
    const totalAmount = subTotal + delivery
    const taxAmount = (totalAmount / 100) * restaurant.tax
    return taxAmount
  }, [restaurant.tax, cart])

  return (
    <View style={styles.cartDetails}>
      <DeliveryCard
        theme={theme}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
        orderDate={orderDate}
        setOrderDate={setOrderDate}
        onOpenShippingModal={onOpenShippingModal}
      />
      <View style={[styles.shadow, styles.roundContainer]}>
        <CartItems
          theme={theme}
          addQuantity={addQuantity}
          removeQuantity={removeQuantity}
          cart={cart}
          deleteItem={deleteItem}
        />
        <PriceContainer
          currency={currency}
          deliveryFee={deliveryFee}
          subTotal={subTotal}
          taxCharges={taxCharges}
        />
        <Voucher
          label={"Don't have a voucher ?"}
          theme={theme}
          onNavigateVoucher={onNavigateVoucher}
          onRemoveVoucher={onRemoveVoucher}
          voucher={voucher}
        />
        <TipView
          label={'Tip'}
          value={tipAmount}
          currency={currency}
          theme={theme}
          subTotal={subTotal}
          setTipAmount={setTipAmount}
        />
        <View style={styles.totalRow}>
          <TextDefault numberOfLines={1} bolder>
            {'Total'}
          </TextDefault>
          <TextDefault bolder>{`${currency} ${(
            subTotal +
            deliveryFee +
            taxCharges +
            tipAmount
          ).toFixed(2)}`}</TextDefault>
        </View>
      </View>
      <Contact
        theme={theme}
        user={user}
        location={location}
        onOpenAddressModal={onOpenAddressModal}
      />
      <Payment
        theme={theme}
        onPress={onSelectPaymentMethod}
        selectedMethod={selectedPaymentMethod}
      />
      <PlaceOrder
        theme={theme}
        cart={cart}
        currency={currency}
        value={subTotal + deliveryFee + taxCharges + tipAmount}
        isLoggedIn={!!user}
      />
    </View>
  )
}

const DeliveryCard = ({
  theme,
  shippingMethod,
  orderDate,
  onOpenShippingModal
}) => {
  return (
    <LinearGradient
      colors={['#90EA93', '#6FCF97']}
      start={{ x: 0.9, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.lgDeliveryCard}>
      <View style={styles.deliveryCard}>
        <View>
          <Image source={require('../../assets/images/cart-cycle.png')} />
        </View>
        <View style={{ marginLeft: 20 }}>
          <TextDefault
            textColor={theme.black}
            bold
            H3
            style={{ ...alignment.MBxSmall }}>
            Delivery time
          </TextDefault>
          <TextDefault style={{ ...alignment.MBxSmall }}>
            {shippingMethod === SHIPPING_METHOD.PICKUP ? 'Pick Up' : 'Delivery'}{' '}
            {` (${orderDate.format('MM-D-YYYY, h:mm a')})`}
          </TextDefault>
          <TouchableOpacity
            onPress={onOpenShippingModal}
            style={{
              backgroundColor: theme.black,
              marginTop: 10,
              paddingVertical: 7,
              borderRadius: 5,
              width: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <TextDefault textColor={theme.white} smaller bold>
              Change
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}
const CartItems = ({
  theme,
  cart,
  addQuantity,
  removeQuantity,
  deleteItem
}) => {
  return (
    <View style={[styles.cartItemsContainer, styles.shadow]}>
      {cart.map(food => (
        <Swipeable
          key={food.key}
          renderRightActions={progress =>
            renderRightSwipe(theme, progress, () => deleteItem(food.key))
          }>
          <CartItem
            title={food.title}
            image={food.image}
            quantity={food.quantity}
            variation={food.variation}
            addons={food.addons}
            price={(parseFloat(food.variation.price) * food.quantity).toFixed(
              2
            )}
            addQuantity={() => {
              addQuantity(food.key)
            }}
            removeQuantity={() => {
              removeQuantity(food.key)
            }}
          />
        </Swipeable>
      ))}
    </View>
  )
}
function renderRightSwipe(theme, progress, deleteItem) {
  const scaleX = progress.interpolate({
    inputRange: [0, 1, 3],
    outputRange: [100, 0, 0]
  })
  return (
    <Animated.View
      style={[styles.trashContainer, { transform: [{ translateX: scaleX }] }]}>
      <RectButton
        rippleColor="black"
        style={styles.trashIcon}
        onPress={deleteItem}>
        <EvilIcons name="trash" size={scale(25)} color={theme.white} />
      </RectButton>
    </Animated.View>
  )
}
const PriceContainer = ({ taxCharges, deliveryFee, subTotal, currency }) => {
  return (
    <View style={styles.priceContainer}>
      <Price label={'Tax Charges'} price={taxCharges} currency={currency} />
      <Price label={'Delivery Fee'} price={deliveryFee} currency={currency} />
      <Price
        label={'SubTotal'}
        price={subTotal + taxCharges + deliveryFee}
        currency={currency}
      />
    </View>
  )
}
const Price = ({ label, price, currency }) => (
  <View style={styles.priceRow}>
    <TextDefault numberOfLines={1} bold>
      {label}
    </TextDefault>
    <TextDefault bold>{`${currency} ${price.toFixed(2)}`}</TextDefault>
  </View>
)

const Voucher = ({
  label,
  theme,
  voucher,
  onNavigateVoucher,
  onRemoveVoucher
}) => {
  return voucher ? (
    <View
      style={[
        styles.voucherEnabledContainer,
        {
          borderColor: theme.secondary,
          backgroundColor: theme.inputBackground
        }
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <VoucherCard />
        <TextDefault bold style={{ margin: '2%' }}>
          First Order
        </TextDefault>
        <TouchableOpacity
          onPress={onRemoveVoucher}
          style={[styles.removeVoucherButton, { backgroundColor: theme.black }]}
          activeOpacity={0.7}>
          <TextDefault bold smaller textColor={theme.white}>
            Remove
          </TextDefault>
        </TouchableOpacity>
      </View>
      <TextDefault bold>- $ {(20).toFixed(2)}</TextDefault>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.voucherContainer}
      onPress={onNavigateVoucher}>
      <TextDefault textColor={theme.secondary}>{label}</TextDefault>
    </TouchableOpacity>
  )
}

const TipView = ({ label, currency, value, theme, subTotal, setTipAmount }) => (
  <View>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '4%'
      }}>
      <TextDefault bold>{label}</TextDefault>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity>
          <TextDefault textColor={theme.secondary} smaller>
            Remove
          </TextDefault>
        </TouchableOpacity>
        <TextDefault
          bold
          style={{ marginLeft: 10 }}>{`${currency} ${value.toFixed(
          2
        )}`}</TextDefault>
      </View>
    </View>
    <View>
      <TipOptions
        theme={theme}
        subTotal={subTotal}
        setTipAmount={setTipAmount}
      />
    </View>
  </View>
)

const TipOptions = ({ theme, subTotal, setTipAmount }) => {
  const [selected, setSelected] = useState(10)
  useEffect(() => {
    setTipAmount((subTotal / 100) * selected)
  }, [subTotal, selected])
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 30,
        borderBottomWidth: 0.5,
        margin: '4%'
      }}>
      <Tip
        theme={theme}
        label={'10%'}
        value={10}
        isSelected={selected === 10}
        setSelected={setSelected}
      />
      <Tip
        theme={theme}
        label={'20%'}
        value={20}
        isSelected={selected === 20}
        setSelected={setSelected}
      />
      <Tip
        theme={theme}
        label={'25%'}
        value={25}
        isSelected={selected === 25}
        setSelected={setSelected}
      />
      <Tip
        theme={theme}
        label={'custom'}
        isSelected={selected !== 10 && selected !== 20 && selected !== 25}
        setSelected={setSelected}
      />
    </View>
  )
}

const Tip = ({ label, value, theme, isSelected, setSelected }) => (
  <TouchableOpacity
    onPress={() => {
      setSelected(value)
    }}
    style={{
      borderRadius: 5,
      height: 20,
      width: 50,
      backgroundColor: isSelected ? theme.tagColor : theme.white,
      borderWidth: isSelected ? 0 : 0.5,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <TextDefault small bold>
      {label}
    </TextDefault>
  </TouchableOpacity>
)

const Contact = ({ theme, user, location, onOpenAddressModal }) => (
  <View style={[styles.shadow, styles.roundContainer]}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 5,
        borderBottomWidth: 0.5,
        margin: '4%'
      }}>
      <LocationMarker />
      <TextDefault bolder H4>
        Contact Information
      </TextDefault>
    </View>
    {user && (
      <View style={{ paddingBottom: 20, borderBottomWidth: 0.5, margin: '4%' }}>
        <ContactRow theme={theme} label={'Email'} value={user.email} />
        <ContactRow theme={theme} label={'Phone'} value={user.phone} />
      </View>
    )}
    <View style={{ paddingBottom: 20, margin: '4%' }}>
      <ContactRow
        theme={theme}
        label={'Address'}
        value={location.deliveryAddress}
        numberOfLines={3}
      />
    </View>
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        onPress={onOpenAddressModal}
        style={[styles.button, { backgroundColor: theme.tagColor }]}>
        <TextDefault small>Delivery details</TextDefault>
      </TouchableOpacity>
    </View>
  </View>
)

const ContactRow = ({ theme, label, value }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 15,
      alignItems: 'flex-end'
    }}>
    <TextDefault H5 bold textColor={theme.grayText} style={{ flex: 1 }} left>
      {label}
      {' :'}
    </TextDefault>
    <TextDefault H5 bold textColor={theme.black} style={{ flex: 1 }} right>
      {value}
    </TextDefault>
  </View>
)
const Payment = ({ theme, onPress, selectedMethod }) => {
  return (
    <View style={[styles.shadow, styles.roundContainer]}>
      <View style={styles.paymentContainer}>
        <PaymentIcon />
        <TextDefault style={{ marginLeft: 5 }} bolder H4>
          Payment method
        </TextDefault>
      </View>
      {selectedMethod ? (
        <TouchableOpacity
          onPress={onPress}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={0.7}>
          <MethodField
            theme={theme}
            icons={selectedMethod.icons}
            label={selectedMethod.label}
          />
          <View
            style={{
              borderRadius: 10,
              backgroundColor: theme.black,
              ...alignment.Psmall,
              ...alignment.Msmall
            }}>
            <TextDefault bold smaller textColor={theme.white}>
              Change
            </TextDefault>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <TouchableOpacity
            style={[styles.button, { borderWidth: 0.5 }]}
            onPress={onPress}
            activeOpacity={0.7}>
            <TextDefault small>+ Add a payment method</TextDefault>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
const PlaceOrder = ({
  currency,
  value,
  theme,
  cart,
  onPress = () => {},
  isLoggedIn = false
}) => (
  <View style={{ flexDirection: 'row', margin: '2%', alignItems: 'center' }}>
    <TextDefault bold H4>
      {`${currency} ${value.toFixed(2)}`}
    </TextDefault>
    <Dot theme={theme} />
    <CartCount value={cart.length} />
    <Dot theme={theme} />
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme.tagColor, flex: 1, height: 50 }
      ]}>
      <TextDefault H4 bold>
        {isLoggedIn ? 'Place Order' : 'LOGIN/SIGNUP'}
      </TextDefault>
    </TouchableOpacity>
  </View>
)
const CartCount = ({ value }) => (
  <View
    style={{
      borderRadius: 10,
      width: 50,
      height: 50,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <TextDefault>{value}</TextDefault>
  </View>
)
const Dot = ({ theme }) => (
  <View
    style={{
      backgroundColor: theme.black,
      borderRadius: 5,
      width: 4,
      height: 4,
      marginHorizontal: 5
    }}
  />
)
export const ShippingDetails = ({
  theme,
  navigation,
  selected,
  user,
  selectAddress
}) => {
  const addresses = user ? user.addresses : []
  return (
    <View style={styles.shippingContainer}>
      <View style={{ flexDirection: 'row' }}>
        <TextDefault H4 bold textColor={theme.main}>
          Deliver to :{' '}
        </TextDefault>
        <TextDefault H4 bolder>
          {selected.label}
        </TextDefault>
      </View>
      <TextDefault small textColor={theme.shadow}>
        {selected.deliveryAddress}
      </TextDefault>
      <View style={{ paddingTop: 40 }}>
        <RoundButton
          theme={theme}
          backgroundColor={theme.white}
          onPress={() => {
            navigation.navigate('SelectLocation')
          }}>
          <>
            <SearchIcon />
            <TextDefault small style={{ marginLeft: 15 }}>
              {'Enter a new address'}
            </TextDefault>
          </>
        </RoundButton>
        <RoundButton theme={theme} backgroundColor={theme.main}>
          <>
            <NavigationIcon />
            <TextDefault small style={{ marginLeft: 15 }}>
              {'Use current location'}
            </TextDefault>
          </>
        </RoundButton>
      </View>
      <View style={{ height: 1, backgroundColor: theme.black, margin: '4%' }} />
      {addresses.map(address => (
        <RoundButton
          key={address._id}
          theme={theme}
          backgroundColor={theme.main}
          border={selected._id === address._id}
          onPress={() => {
            selectAddress({
              _id: address._id,
              deliveryAddress: address.deliveryAddress,
              details: address.details,
              label: address.label,
              latitude: Number(address.location.coordinates[1]),
              longitude: Number(address.location.coordinates[0])
            })
          }}>
          <>
            <NavigationIcon />
            <View
              style={{
                marginHorizontal: 15,
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center'
              }}>
              <View style={{ flex: 1 }}>
                <TextDefault small bold>
                  {address.label}
                </TextDefault>
                <TextDefault
                  style={{ flex: 1 }}
                  smaller
                  textColor={theme.shadow}>
                  {address.deliveryAddress}
                </TextDefault>
              </View>
              <View style={{ margin: 10 }}>
                <EditPenIcon />
              </View>
              <View style={{ margin: 10 }}>
                <TrashIcon />
              </View>
            </View>
          </>
        </RoundButton>
      ))}
    </View>
  )
}

const RoundButton = ({
  backgroundColor,
  children,
  border,
  onPress = () => {}
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.shadow,
      styles.roundButton,
      {
        backgroundColor,
        borderWidth: border ? 1.5 : 0
      }
    ]}>
    {children}
  </TouchableOpacity>
)
