import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, TouchableOpacity, StatusBar, Platform } from 'react-native'
import navigationService from '../../routes/navigationService'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ActiveOrders from '../../components/MyOrders/ActiveOrders'
import PastOrders from '../../components/MyOrders/PastOrders'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { scale } from '../../utils/scaling'
import Analytics from '../../utils/analytics'
import OrdersContext from '../../context/Orders'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'
import ReviewModal from '../../components/Review'

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
const orderStatusInactive = ['DELIVERED', 'COMPLETED','CANCELLED','CANCELLEDBYREST']

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

function MyOrders(props) {
  const reviewModalRef = useRef()
  const [reviewInfo, setReviewInfo] = useState()
  const analytics = Analytics()
  const { t, i18n } = useTranslation()
  const {
    orders,
    loadingOrders,
    errorOrders,
    reFetchOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders
  } = useContext(OrdersContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  const [selectedTab, setSelectedTab] = useState('current')
  const inset = useSafeAreaInsets()
  const activeOrders = useMemo(() => {
    return orders.filter(o => orderStatusActive.includes(o.orderStatus))
  }, [orders])
  const pastOrders = useMemo(() => {
    return orders.filter(o => orderStatusInactive.includes(o.orderStatus))
  }, [orders])
  const openReviewModal = ()=>{
    reviewModalRef.current.open()
  }
  const closeReviewModal = ()=>{
    reviewModalRef.current.close()
  }

  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_MYORDERS)
    }
    Track()
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={styles().backButton}>
              <MaterialIcons name="arrow-back" size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      ),
      headerTitle: t('titleOrders'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      }
    })
  }, [props?.navigation])

  const TabButton = ({ text, onPress, isSelected, currentTheme }) => {
    return (
      <View
        style={
          isSelected
            ? styles(currentTheme).activeTabStyles
            : styles(currentTheme).inactiveTabStyles
        }>
        <TouchableOpacity onPress={onPress}>
          <TextDefault
            H4
            bold
            textColor={isSelected ? currentTheme.newFontcolor : currentTheme.gray500}>
            {t(text)}
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
  }

  const onPressReview = (order, selectedRating)=>{
    setReviewInfo({order, selectedRating})
    openReviewModal()
  }
  
  const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();
  if (!connect) return <ErrorView refetchFunctions={[reFetchOrders]} />
  return (
    <>
      <View style={styles(currentTheme).container}>
        <View style={styles(currentTheme).tabContainer}>
          <TabButton
            text={t('current')}
            onPress={() => setSelectedTab('current')}
            isSelected={selectedTab === 'current'}
            currentTheme={currentTheme}
          />

          <TabButton
            text={t('past')}
            onPress={() => setSelectedTab('past')}
            isSelected={selectedTab === 'past'}
            currentTheme={currentTheme}
          />
        </View>
        {selectedTab === 'current' && (
          <ActiveOrders
            navigation={props?.navigation}
            activeOrders={activeOrders}
            loading={loadingOrders}
            error={errorOrders}
          />
        )}
        {selectedTab === 'past' && (
          <PastOrders
            navigation={props?.navigation}
            pastOrders={pastOrders}
            loading={loadingOrders}
            error={errorOrders}
            onPressReview={onPressReview}
          />
        )}

        <View
          style={{
            paddingBottom: inset.bottom,
            backgroundColor: currentTheme.themeBackground
          }}
        />
      </View>
      <ReviewModal ref={reviewModalRef} onOverlayPress={closeReviewModal} theme={currentTheme} orderId={reviewInfo?.order._id} rating={reviewInfo?.selectedRating}/>
    </>
  )
}

export default MyOrders
