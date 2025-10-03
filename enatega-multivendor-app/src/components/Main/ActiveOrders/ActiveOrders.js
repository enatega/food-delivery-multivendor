import React, { useContext, useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useNavigation } from '@react-navigation/native'
import TextError from '../../Text/TextError/TextError'
import OrdersContext from '../../../context/Orders'
import Spinner from '../../Spinner/Spinner'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { Modalize } from 'react-native-modalize'
import { ProgressBar, checkStatus } from './ProgressBar'
import styles from './styles'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { calulateRemainingTime } from '../../../utils/customFunctions'
import { MaterialIcons } from '@expo/vector-icons'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)
const MINIMIZED_HEIGHT = scale(60)

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']

const ActiveOrders = ({ onActiveOrdersChange }) => {
  const { t, i18n } = useTranslation()
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const activeOrders = orders.filter(
    (o) =>
      orderStatusActive.includes(o.orderStatus) &&
      (o?.paymentStatus === 'PAID' || o?.paymentMethod == 'COD')
  )

  const onPressDetails = (order) => {
    navigation.navigate('OrderDetail', {
      _id: order._id,
      order: order,
      currencySymbol: configuration.currencySymbol
    })
  }

  const [showAll, setShowAll] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [justPlacedOrder, setJustPlacedOrder] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const modalizeRef = useRef(null)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const timeUpdateInterval = useRef(null)

  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 2)

  // Real-time timer update effect
  useEffect(() => {
    if (displayOrders.length > 0) {
      // Update time every 60 seconds for real-time updates
      timeUpdateInterval.current = setInterval(() => {
        setCurrentTime(new Date())
      }, 60000)
    } else {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current)
        timeUpdateInterval.current = null
      }
    }

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current)
        timeUpdateInterval.current = null
      }
    }
  }, [displayOrders.length])

  useEffect(() => {
    const hasActiveOrders = displayOrders.length > 0
    onActiveOrdersChange(hasActiveOrders)
    
    // Reset states when no active orders
    if (!hasActiveOrders) {
      setIsMinimized(false)
      setJustPlacedOrder(false)
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current)
        timeUpdateInterval.current = null
      }
      return
    }
    
    // Auto-minimize after 3 seconds when a new order is detected
    if (hasActiveOrders && !justPlacedOrder) {
      setJustPlacedOrder(true)
      const timer = setTimeout(() => {
        setIsMinimized(true)
        setShowPulse(true)
        
        // Start pulse animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ).start()
        
        const pulseTimer = setTimeout(() => {
          setShowPulse(false)
        }, 5000)
        return () => clearTimeout(pulseTimer)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [displayOrders, onActiveOrdersChange, justPlacedOrder])

  const handleMinimize = () => {
    setIsMinimized(true)
    // Update time immediately when minimizing
    setCurrentTime(new Date())
  }

  const handleExpand = () => {
    setIsMinimized(false)
    // Update time immediately when expanding
    setCurrentTime(new Date())
  }

  if (loadingOrders) return null
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  if (!displayOrders.length) return null
  const order = displayOrders[0]
  
  // Calculate real-time remaining time
  const getRealTimeRemainingTime = (order) => {
    if (!order?.createdAt || !order?.expectedTime) {
      return calulateRemainingTime(order)
    }
    
    const orderTime = new Date(order.createdAt)
    const expectedDeliveryTime = new Date(orderTime.getTime() + (order.expectedTime * 60000)) // expectedTime in minutes
    const now = currentTime
    const timeDiff = expectedDeliveryTime.getTime() - now.getTime()
    const minutesRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60)))
    
    return minutesRemaining || calulateRemainingTime(order)
  }
  
  const remainingTime = getRealTimeRemainingTime(order)
  const modalStyle = {
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: currentTheme.cardBackground
  }

  // Render minimized tab
  if (isMinimized) {
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: scale(20),
            [currentTheme.isRTL ? 'left' : 'right']: scale(20),
            zIndex: 1000,
            transform: [{ scale: showPulse ? pulseAnim : 1 }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles(currentTheme).minimizedTab}
          onPress={handleExpand}
          activeOpacity={0.8}
        >
          <View style={styles(currentTheme).minimizedContent}>
            <MaterialIcons 
              name="delivery-dining" 
              size={scale(20)} 
              color={currentTheme.white} 
            />
            <TextDefault 
              textColor={currentTheme.white} 
              H5 
              bold 
              style={{ marginLeft: scale(8) }}
            >
              {t('orderTracking')}
            </TextDefault>
            <View style={styles(currentTheme).minimizedBadge}>
              <TextDefault 
                textColor={currentTheme.white} 
                H6 
                bold
              >
                {remainingTime > 0 ? `${remainingTime}m` : 'Soon'}
              </TextDefault>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <Modalize
      ref={modalizeRef}
      alwaysOpen={MODAL_HEIGHT}
      withHandle={false}
      modalHeight={MODAL_HEIGHT}
      modalStyle={modalStyle}
    >
      <View style={{ marginTop: scale(20), marginHorizontal: scale(10) }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
            alignItems: 'center'
          }}
        >
          <TextDefault Regular textColor={currentTheme.fontGrayNew}>
            {t('estimatedDeliveryTime')}
          </TextDefault>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={handleMinimize}
              style={{ marginRight: scale(15) }}
            >
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={scale(20)} 
                color={currentTheme.gray700} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressDetails(order)}>
              <TextDefault textColor={currentTheme.gray700} bolder>
                {t('details')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: scale(10) }}>
          <TextDefault Regular textColor={currentTheme.gray900} H1 bolder isRTL>
            {remainingTime > 0 
              ? `${remainingTime}-${remainingTime + 5} ${t('mins')}`
              : `${t('deliveringSoon')}`
            }
          </TextDefault>
        </View>
        <View>
          <ProgressBar
            configuration={configuration}
            currentTheme={currentTheme}
            item={order}
            navigation={navigation}
            isPicked={order?.isPickedUp}
          />
          <View style={{ marginTop: scale(10) }}>
            <TextDefault
              numberOfLines={2}
              style={styles(currentTheme).statusText}
              isRTL
            >
              {t(checkStatus(order.orderStatus).statusText)}
            </TextDefault>
          </View>
        </View>
      </View>
    </Modalize>
  )
}

export default ActiveOrders
