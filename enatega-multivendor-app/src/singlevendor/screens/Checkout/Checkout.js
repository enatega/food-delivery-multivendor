import React, { useState, useContext, useLayoutEffect, useRef } from 'react';
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
import VoucherBottomSheet from '../../components/Checkout/VoucherBottomSheet';
import useScheduleStore from '../../stores/scheduleStore';
import styles from './Styles';

const Checkout = (props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const themeContext = useContext(ThemeContext);
  const { cart, cartCount } = useContext(UserContext);
  
  // Get schedule from Zustand store
  const { selectedSchedule } = useScheduleStore();
  
  // Ref for voucher bottom sheet
  const voucherBottomSheetRef = useRef(null);
  
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
  const [deliveryTime, setDeliveryTime] = useState(selectedSchedule ? 'schedule' : 'standard'); // 'priority', 'standard', 'schedule'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'voucher'
  const [selectedCard, setSelectedCard] = useState('**** 9432');
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [tipAmount, setTipAmount] = useState(1);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Console log when fulfillment mode changes
  React.useEffect(() => {
    console.log('📦 Fulfillment Mode Changed:', fulfillmentMode);
  }, [fulfillmentMode]);

  // Console log when delivery time changes
  React.useEffect(() => {
    console.log('⏰ Delivery Time Changed:', deliveryTime);
    if (deliveryTime === 'schedule' && selectedSchedule) {
      console.log('📅 Scheduled Details:', {
        date: selectedSchedule.dateLabel,
        time: selectedSchedule.timeSlot.time,
        timeSlotId: selectedSchedule.timeSlot.id,
        startTime: selectedSchedule.timeSlot.startTime,
        endTime: selectedSchedule.timeSlot.endTime
      });
    }
  }, [deliveryTime, selectedSchedule]);

  // Update delivery time when returning from schedule screen
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar);
      }
      StatusBar.setBarStyle(
        themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
      );
      
      // Update delivery time based on schedule
      if (selectedSchedule) {
        setDeliveryTime('schedule');
      } else if (deliveryTime === 'schedule') {
        // If schedule was cleared but deliveryTime is still 'schedule', reset to standard
        setDeliveryTime('standard');
      }
    }, [currentTheme, themeContext, selectedSchedule])
  );

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
        borderBottomWidth: 0,
        height: scale(100)
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
    // Prepare order data with complete delivery information
    const orderData = {
      fulfillmentMode,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      tipAmount,
      total,
      subtotal,
      deliveryFee,
      items: cart,
      orderNumber: '#' + Math.floor(100000 + Math.random() * 900000),
      // Delivery preferences (only for delivery mode)
      ...(fulfillmentMode === 'delivery' && {
        deliveryPreferences: {
          leaveAtDoor,
          callOnArrival,
          courierInstructions
        }
      }),
      // Include scheduled delivery details if schedule is selected
      ...(deliveryTime === 'schedule' && selectedSchedule && {
        scheduledDelivery: {
          date: selectedSchedule.date,
          dateLabel: selectedSchedule.dateLabel,
          dayName: selectedSchedule.dayName,
          timeSlot: {
            id: selectedSchedule.timeSlot.id,
            time: selectedSchedule.timeSlot.time,
            startTime: selectedSchedule.timeSlot.startTime,
            endTime: selectedSchedule.timeSlot.endTime
          }
        }
      })
    };
    
    console.log('🛒 PLACE ORDER - Complete Order Data:', orderData);
    
    // Navigate to Order Confirmation screen
    navigation.navigate('OrderConfirmation', { orderData });
  };

  const isOrderValid = () => {
    if (fulfillmentMode === 'delivery' && !deliveryAddress) {
      // return false later , now temporarily returning true
      return true;
    }
    return cart.length = 0;
  };

  const handleApplyVoucher = (voucherCode) => {
    console.log('🎟️ Applying voucher:', voucherCode);
    setSelectedVoucher(voucherCode);
    // TODO: Implement voucher validation and discount calculation
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
          scheduledTime={selectedSchedule}
        />

        {/* Payment Section */}
        <PaymentSection
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          selectedCard={selectedCard}
          selectedVoucher={selectedVoucher}
          onChangeCard={() => {/* TODO: Navigate to payment methods */}}
          onChangeVoucher={() => {/* TODO: Navigate to vouchers */}}
          voucherBottomSheetRef={voucherBottomSheetRef}
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
            // textColor="#fff"
            bolder
            H5
          >
            {t('Place order') || 'Place order'}
          </TextDefault>
        </TouchableOpacity>
      </View>

      {/* Voucher Bottom Sheet */}
      <VoucherBottomSheet
        ref={voucherBottomSheetRef}
        onApplyVoucher={handleApplyVoucher}
      />
    </View>
  );
};

export default Checkout;
