import React, { useEffect, useMemo, useRef } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import styles from './styles'
import { CartDetails, Map, ShippingDetails } from './Cart.components'
import useCart from './useCart'
import ShippingMethod from '../../components/ShippingMethod'
import { Modalize } from 'react-native-modalize'

const MODAL_PROPS = {
  modalHeight: 350,
  handlePosition: 'inside',
  openAnimationConfig: {
    timing: { duration: 400 },
    spring: { speed: 20, bounciness: 10 }
  },
  closeAnimationConfig: {
    timing: { duration: 400 },
    spring: { speed: 20, bounciness: 10 }
  }
}

const Cart = ({ navigation }) => {
  const {
    theme,
    location,
    setLocation,
    orderDate,
    addQuantity,
    removeQuantity,
    deleteItem,
    cart,
    loadingRestaurant,
    dataRestaurant,
    profile,
    configuration,
    tipAmount,
    setTipAmount,
    shippingMethod,
    setShippingMethod,
    setOrderDate,
    shippingMethodModalRef,
    onOpenShippingModal,
    addressModalRef,
    onOpenAddressModal,
    onSelectPaymentMethod,
    selectedPaymentMethod,
    onNavigateVoucher,
    onRemoveVoucher,
    voucher
  } = useCart({ navigation })
  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])
  const insets = useSafeAreaInsets()
  const animation = useRef()
  const MapView = useMemo(() => <Map location={location} />, [location])
  if (loadingRestaurant) {
    return (
      <LottieView
        autoPlay
        ref={animation}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#eee'
        }}
        source={require('../../assets/loading-cart.json')}
      />
    )
  }
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { top: insets.top, bottom: insets.bottom }
        ]}>
        {MapView}
        <CartDetails
          theme={theme}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          onOpenShippingModal={onOpenShippingModal}
          orderDate={orderDate}
          setOrderDate={setOrderDate}
          addQuantity={addQuantity}
          removeQuantity={removeQuantity}
          cart={cart}
          deleteItem={deleteItem}
          restaurant={dataRestaurant.restaurant}
          configuration={configuration}
          tipAmount={tipAmount}
          setTipAmount={setTipAmount}
          user={profile}
          location={location}
          onOpenAddressModal={onOpenAddressModal}
          onSelectPaymentMethod={onSelectPaymentMethod}
          selectedPaymentMethod={selectedPaymentMethod}
          onNavigateVoucher={onNavigateVoucher}
          onRemoveVoucher={onRemoveVoucher}
          voucher={voucher}
        />
      </ScrollView>
      <Modalize ref={shippingMethodModalRef} {...MODAL_PROPS}>
        <ShippingMethod
          minimumTime={new Date()}
          setOrderDate={setOrderDate}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          orderDate={orderDate}
        />
      </Modalize>
      <Modalize ref={addressModalRef} {...MODAL_PROPS}>
        <ShippingDetails
          theme={theme}
          navigation={navigation}
          selected={location}
          user={profile}
          selectAddress={setLocation}
        />
      </Modalize>
    </>
  )
}

export default Cart
