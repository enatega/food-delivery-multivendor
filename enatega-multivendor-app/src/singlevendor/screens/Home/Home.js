import { View, SafeAreaView, Platform, StatusBar, FlatList, RefreshControl } from 'react-native'
import React, { useLayoutEffect, useContext, useMemo } from 'react'

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
import HomeBanner from '../../components/Home/HomeBanner'
import OfflineBanner from '../../components/Home/OfflineBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'

import navigationOptions from './navigationOptions'
import MainModalize from '../../../components/Main/Modalize/MainModalize'
import styles from './Styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'

import useCart from '../Cart/useCart'
import AddressModalHeader from '../../components/Home/AddressModalHeader'
import AddressModalFooter from '../../components/Home/AddressModalFooter'
import OrderConfirmation from '../Checkout/OrderConfirmation'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

const Home = () => {
  const { data, currentTheme, t, isLoggedIn, profile, addressIcons, location, setAddressLocation, onOpen, modalRef, bannersData, isConnected, refetch, refetchBanners } = useHome()
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetch, refetchBanners])
  useCart()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor ?? []

  const navigation = useNavigation()
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
        headerBorderColor:
          currentTheme.newBorderColor2 ||
          currentTheme.colorBorder ||
          currentTheme.horizontalLine ||
          'rgba(148, 163, 184, 0.28)',
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
      <View style={styles(currentTheme).listHeader}>
        {isConnected
          ? (
          <>
            <HomeBanner banners={bannersData?.banners || []} />
            {orderConfirmation}
          </>
            )
          : (
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
