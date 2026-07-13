import { Pressable, TouchableOpacity, View, SafeAreaView, Platform, StatusBar, FlatList, RefreshControl } from 'react-native'
import React, { useLayoutEffect, useRef, useContext, useMemo } from 'react'

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
import HomeBanner from '../../components/Home/HomeBanner'
import OfflineBanner from '../../components/Home/OfflineBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'

import navigationOptions from './navigationOptions'
import MainModalize from '../../../components/Main/Modalize/MainModalize'
import styles from './Styles'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

import PromoBanner from '../../components/Profile/PromoBanner'
import useCart from '../Cart/useCart'
import AddressModalHeader from '../../components/Home/AddressModalHeader'
import AddressModalFooter from '../../components/Home/AddressModalFooter'
import RestaurantScheduleTime from '../../components/RestaurantScheduleTime/RestaurantScheduleTime'
import OrderConfirmation from '../Checkout/OrderConfirmation'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

const Home = () => {
  const { data, currentTheme, t, isLoggedIn, profile, addressIcons, location, setAddressLocation, onOpen, modalRef, bannersData, isConnected, refetch, refetchBanners } = useHome()
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetch, refetchBanners])
  const {} = useCart()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor ?? []

  const navigation = useNavigation()

  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.themeBackground,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.iconColor,
        open: onOpen,
        navigation
      })
    )
  }, [navigation, currentTheme])

  const modalHeader = () => <AddressModalHeader onClose={() => modalRef.current.close()}></AddressModalHeader>

  const modalFooter = () => <AddressModalFooter onClose={() => modalRef.current.close()}></AddressModalFooter>

  const orderConfirmation = useMemo(() => <OrderConfirmation isHome={true} />, [])
  const listHeader = useMemo(
    () => (
      <View style={{ marginTop: 30 }}>
        {isConnected ? (
          <>
            <HomeBanner banners={bannersData?.banners || []} />
            {orderConfirmation}
          </>
        ) : (
          <OfflineBanner currentTheme={currentTheme} t={t} />
        )}
        <HorizontalCategoriesList categoriesData={categoriesData} />
      </View>
    ),
    [isConnected, bannersData, orderConfirmation, currentTheme, t, categoriesData]
  )
  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <FlatList
        data={categoriesData}
        renderItem={({ item }) => <WrapperHorizontalProductsList data={item} listTitle={item?.name} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}
      />

      <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
    </SafeAreaView>
  )
}

export default Home
