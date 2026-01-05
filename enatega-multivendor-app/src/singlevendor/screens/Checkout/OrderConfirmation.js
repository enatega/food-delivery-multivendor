import React, { useState, useContext, useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import ConfigurationContext from '../../../context/Configuration';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import { textStyles } from '../../../utils/textStyles';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';
import OrderSummary from '../../components/Checkout/OrderSummary';

import {
  OrderStatusTimeline,
  ORDER_STATUSES,
  DeliveryTimeBanner,
  DeliveryDetailsCard,
  ContactCourierCard,
  OrderItemsSection,
  DeliveryMap,
  DeliveredStatus
} from '../../components/Checkout/OrderConfirmation';

import styles from './OrderConfirmationStyles';

const OrderConfirmation = (props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const themeContext = useContext(ThemeContext);

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  const currencySymbol = configuration?.currencySymbol || '€';

  // Get order data from route params
  const orderData = props?.route?.params?.orderData || {};
  
  // State
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Mock data - replace with actual order data
  const [orderStatus, setOrderStatus] = useState(orderData.status || ORDER_STATUSES.PICKED_UP);
  const [statusTimes] = useState({
    confirmed: '8:00 pm',
    packed: '8:10 pm',
    picked_up: '8:15 pm'
  });

  const isDelivered = orderStatus === ORDER_STATUSES.DELIVERED;
  // const isDelivered = true;

  // Mock locations - replace with actual data
  const customerLocation = {
    latitude: 25.2945,
    longitude: 51.5058
  };

  const riderLocation = {
    latitude: 25.2852,
    longitude: 51.5196
  };

  // Dummy order items for testing
  const orderItems = [
    {
      id: '1',
      title: 'Apple Juice',
      description: 'Golden Delicious Apples, Filter Water, Ascorbic Acid',
      price: 8.74,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      title: 'Veggie Spring Roll',
      description: 'Fresh vegetables, rice paper wrapper, sweet chili sauce',
      price: 3.66,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      title: 'Mango Smoothie',
      description: 'Fresh mango, yogurt, honey',
      price: 5.50,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=100&h=100&fit=crop'
    }
  ];

  // Calculate totals
  const subtotal = orderData.subtotal || orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderData.deliveryFee || 0;
  const tipAmount = orderData.tipAmount || 0;
  const total = orderData.total || (subtotal + deliveryFee + tipAmount);
  const orderNumber = orderData.orderNumber || '#365421';

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar);
      }
      StatusBar.setBarStyle(
        themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
      );
    }, [currentTheme, themeContext])
  );

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: isDelivered ? (t('Your order') || 'Your order') : (t('Confirmation') || 'Confirmation'),
      headerRight: isDelivered ? null : () => (
        <TouchableOpacity style={styles(currentTheme).helpButton}>
          <Feather name="help-circle" size={24} color={currentTheme.fontMainColor} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        shadowRadius: 0,
        elevation: 0,
        borderBottomWidth: 0,
        height: scale(100)
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={{ marginLeft: scale(10) }}>
              <View style={styles(currentTheme).backButton}>
                {isDelivered ? (
                  <Feather name="x" size={20} color={currentTheme.fontMainColor} />
                ) : (
                  <AntDesign name="arrowleft" size={20} color={currentTheme.fontMainColor} />
                )}
              </View>
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    });
  }, [props?.navigation, currentTheme, isDelivered]);

  const handleContactCourier = () => {
    // Navigate to chat or call courier
    // navigation.navigate('ChatWithRider');
    console.log("contact courier clicked")
  };

  return (
    <View style={styles(currentTheme).mainContainer}>
      <ScrollView
        style={styles().scrollView}
        contentContainerStyle={styles().contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isDelivered ? (
          // Delivered State
          <DeliveredStatus appName="FAST" />
        ) : (
          // Tracking State
          <>
            <DeliveryTimeBanner minTime={15} maxTime={25} />
            <OrderStatusTimeline
              currentStatus={orderStatus}
              statusTimes={statusTimes}
            />
          </>
        )}

        {/* Delivery Details */}
        <DeliveryDetailsCard
          addressLabel="Home"
          address="45 Al Jazeera Street, Doha, Qatar"
          showMap={showMap}
          onToggleMap={setShowMap}
          mapComponent={
            <DeliveryMap
              customerLocation={customerLocation}
              riderLocation={riderLocation}
              showRoute={!isDelivered}
            />
          }
        />

        {/* Contact Courier - only show when not delivered */}
        {!isDelivered && (
          <ContactCourierCard
            onPress={handleContactCourier}
            contactlessDelivery={true}
          />
        )}

        {/* Order Items */}
        <OrderItemsSection
          items={orderItems}
          currencySymbol={currencySymbol}
          initialExpanded={false}
        />

        {/* Spacer for sticky bottom */}
        <View style={{ height: scale(180) }} />
      </ScrollView>

      {/* Sticky Bottom: Summary */}
      <View style={styles(currentTheme).stickyBottomContainer}>
        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          tipAmount={tipAmount}
          total={total}
          currencySymbol={currencySymbol}
          expanded={summaryExpanded}
          onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)}
          orderNumber={summaryExpanded ? orderNumber : null}
        />
      </View>
    </View>
  );
};

export default OrderConfirmation;
