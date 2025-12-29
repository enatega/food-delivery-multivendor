import React, { useState, useContext, useLayoutEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';

import ThemeContext from '../../../ui/ThemeContext/ThemeContext';
import ConfigurationContext from '../../../context/Configuration';
import { theme } from '../../../utils/themeColors';
import { scale } from '../../../utils/scaling';
import { alignment } from '../../../utils/alignment';
import { textStyles } from '../../../utils/textStyles';
import TextDefault from '../../../components/Text/TextDefault/TextDefault';

import CartItem from '../../components/Cart/CartItem';
import EmptyCart from '../../components/Cart/EmptyCart';
import OrderProgressBanner from '../../components/Cart/OrderProgressBanner';
import RecommendedProducts from '../../components/Cart/RecommendedProducts';
import { mockCartItems, mockRecommendedProducts } from '../../assets/cartMockData';
import styles from './Styles';

const Cart = (props) => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const configuration = useContext(ConfigurationContext);
  const themeContext = useContext(ThemeContext);
  
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  };

  // Mock data - Replace with your actual data
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [recommendedProducts] = useState(mockRecommendedProducts);
  
  const minimumOrder = 10; // Minimum order to place
  const lowOrderFeeThreshold = 15; // Threshold to avoid low-order fee
  const lowOrderFee = 2; // Low-order fee amount
  const currencySymbol = configuration?.currencySymbol || '€';

  // Calculate total from cart items
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = parseFloat(calculateTotal());

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
      title: t('cart') || 'Cart',
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
        backgroundColor: currentTheme.newheaderBG
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <AntDesign 
                name='arrowleft' 
                size={22} 
                color={currentTheme.newIconColor} 
              />
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    });
  }, [props?.navigation, currentTheme]);

  const handleStartShopping = () => {
    // TODO: Navigate to your home/products screen
    navigation.goBack();
  };

  const handleCheckout = () => {
    navigation.navigate('SingleVendorCheckout');
  };

  const handleAddQuantity = (itemKey) => {
    // TODO: Replace with your actual add quantity logic
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.key === itemKey ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemoveQuantity = (itemKey) => {
    // TODO: Replace with your actual remove quantity logic
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.key === itemKey ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleAddToCart = (product) => {
    // TODO: Replace with your actual add to cart logic
    console.log('Add to cart:', product);
  };

  const handleProductPress = (product) => {
    // TODO: Navigate to product detail
    console.log('Product pressed:', product);
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles(currentTheme).mainContainer}>
        <OrderProgressBanner
          currentTotal={total}
          minimumOrder={minimumOrder}
          lowOrderFeeThreshold={lowOrderFeeThreshold}
          lowOrderFee={lowOrderFee}
          currencySymbol={currencySymbol}
        />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <EmptyCart onStartShopping={handleStartShopping} />
          
          {recommendedProducts.length > 0 && (
            <View style={styles().recommendedSection}>
              <RecommendedProducts
                products={recommendedProducts}
                onAddToCart={handleAddToCart}
                onProductPress={handleProductPress}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Cart with items view
  return (
    <SafeAreaView style={styles(currentTheme).mainContainer}>
      <OrderProgressBanner
        currentTotal={total}
        minimumOrder={minimumOrder}
        lowOrderFeeThreshold={lowOrderFeeThreshold}
        lowOrderFee={lowOrderFee}
        currencySymbol={currencySymbol}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles().scrollView}
      >
        <View style={styles().contentContainer}>
          <TextDefault 
            textColor={currentTheme.fontMainColor} 
            bolder 
            H4
            style={{ marginBottom: scale(16) }}
          >
            {t('yourItems') || 'Your items'}
          </TextDefault>

          {cartItems.map((item, index) => (
            <CartItem
              key={item.key || index}
              item={item}
              onAddQuantity={() => handleAddQuantity(item.key)}
              onRemoveQuantity={() => handleRemoveQuantity(item.key)}
              currencySymbol={currencySymbol}
              isLastItem={index === cartItems.length - 1}
            />
          ))}
        </View>

        {recommendedProducts.length > 0 && (
          <View style={styles().recommendedSection}>
            <RecommendedProducts
              products={recommendedProducts}
              onAddToCart={handleAddToCart}
              onProductPress={handleProductPress}
            />
          </View>
        )}
      </ScrollView>

      {/* Sticky Checkout Button */}
      <View style={styles(currentTheme).stickyCheckoutContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).checkoutButton,
            total < minimumOrder && styles(currentTheme).checkoutButtonDisabled
          ]}
          onPress={total >= minimumOrder ? handleCheckout : null}
          disabled={total < minimumOrder}
        >
          <View style={styles().checkoutButtonContent}>
            <View style={[
              styles().cartBadge,
              total >= minimumOrder && styles().cartBadgeActive
            ]}>
              <TextDefault 
                textColor={total >= minimumOrder ? currentTheme.primaryBlue : currentTheme.gray300} 
                bold
                small
              >
                {cartCount}
              </TextDefault>
            </View>
            <TextDefault 
              textColor={total >= minimumOrder ? currentTheme.white : currentTheme.gray300} 
              bolder
              H5
            >
              {t('goToCheckout') || 'Go to checkout'} {currencySymbol}{total}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

