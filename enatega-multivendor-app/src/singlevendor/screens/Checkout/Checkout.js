import React, { useState, useContext, useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import ConfigurationContext from '../../../context/Configuration';
import UserContext from '../../../context/User';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import { alignment } from '../../../utils/alignment';
import { textStyles } from '../../../utils/textStyles';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

import FulfillmentTabs from '../../components/Checkout/FulfillmentTabs';
import DeliveryOptions from '../../components/Checkout/DeliveryOptions';
import DeliveryTimeOptions from '../../components/Checkout/DeliveryTimeOptions';
import PaymentSection from '../../components/Checkout/PaymentSection';
import TipSection from '../../components/Checkout/TipSection';
import OrderSummary from '../../components/Checkout/OrderSummary';
import styles from './Styles';

const Checkout = (props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const themeContext = useContext(ThemeContext);
  const { cart, cartCount } = useContext(UserContext);
  
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const currencySymbol = configuration?.currencySymbol || '€';

  // State management
  const [fulfillmentMode, setFulfillmentMode] = useState('delivery'); // 'delivery' or 'collection'
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [leaveAtDoor, setLeaveAtDoor] = useState(false);
  const [callOnArrival, setCallOnArrival] = useState(false);
  const [courierInstructions, setCourierInstructions] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('standard'); // 'priority', 'standard', 'schedule'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'voucher'
  const [selectedCard, setSelectedCard] = useState('**** 9432');
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [tipAmount, setTipAmount] = useState(1);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar);
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    );
  });

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('Checkout') || 'Checkout',
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: { height: 0 },
        elevation: 0,
        borderBottomWidth: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <View style={{
                width: scale(36),
                height: scale(36),
                borderRadius: scale(18),
                backgroundColor: currentTheme.colorBgTertiary || '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <AntDesign 
                  name='arrowleft' 
                  size={20} 
                  color={currentTheme.fontMainColor || '#000'} 
                />
              </View>
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    });
  }, [props?.navigation, currentTheme]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = fulfillmentMode === 'delivery' && deliveryTime === 'priority' ? 1.99 : 0;
  const tipAmountToAdd = fulfillmentMode === 'delivery' ? tipAmount : 0;
  const total = subtotal + deliveryFee + tipAmountToAdd;

  const handlePlaceOrder = () => {
    // TODO: Implement order placement logic
    console.log('Place order', {
      fulfillmentMode,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      tipAmount,
      total
    });
  };

  const isOrderValid = () => {
    if (fulfillmentMode === 'delivery' && !deliveryAddress) {
      return false;
    }
    return cart.length > 0;
  };

  return (
    <View style={styles(currentTheme).mainContainer}>
      <ScrollView 
        style={styles().scrollView}
        contentContainerStyle={styles().contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Fulfillment Mode Tabs */}
        <FulfillmentTabs
          selectedMode={fulfillmentMode}
          onSelectMode={setFulfillmentMode}
        />

        {/* Delivery Options (only for delivery mode) */}
        {fulfillmentMode === 'delivery' && (
          <DeliveryOptions
            deliveryAddress={deliveryAddress}
            onSelectAddress={() => navigation.navigate('Addresses')}
            leaveAtDoor={leaveAtDoor}
            onToggleLeaveAtDoor={setLeaveAtDoor}
            callOnArrival={callOnArrival}
            onToggleCallOnArrival={setCallOnArrival}
            courierInstructions={courierInstructions}
            onChangeCourierInstructions={setCourierInstructions}
          />
        )}

        {/* Delivery/Collection Time Options */}
        <DeliveryTimeOptions
          selectedTime={deliveryTime}
          onSelectTime={setDeliveryTime}
          mode={fulfillmentMode}
        />

        {/* Payment Section */}
        <PaymentSection
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          selectedCard={selectedCard}
          selectedVoucher={selectedVoucher}
          onChangeCard={() => {/* TODO: Navigate to payment methods */}}
          onChangeVoucher={() => {/* TODO: Navigate to vouchers */}}
        />

        {/* Tip Section (only for delivery mode) */}
        {fulfillmentMode === 'delivery' && (
          <TipSection
            selectedTip={tipAmount}
            onSelectTip={setTipAmount}
            currencySymbol={currencySymbol}
          />
        )}

        {/* Spacer for sticky bottom section */}
        <View style={{ height: scale(180) }} />
      </ScrollView>

      {/* Sticky Bottom Section: Summary + Place Order Button */}
      <View style={styles(currentTheme).stickyBottomContainer}>
        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          tipAmount={tipAmountToAdd}
          total={total}
          currencySymbol={currencySymbol}
          expanded={summaryExpanded}
          onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)}
        />

        {/* Place Order Button */}
        <TouchableOpacity
          style={[
            styles(currentTheme).placeOrderButton,
            !isOrderValid() && styles(currentTheme).placeOrderButtonDisabled
          ]}
          onPress={handlePlaceOrder}
          disabled={!isOrderValid()}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={isOrderValid() ? '#fff' : currentTheme.fontSecondColor}
            bolder
            H5
          >
            {t('Place order') || 'Place order'}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;
