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
import SectionErrorCard from '../../components/SectionErrorCard'

const Home = () => {
  const {
    data,
    error,
    currentTheme,
    t,
    isLoggedIn,
    profile,
    addressIcons,
    location,
    setAddressLocation,
    onOpen,
    modalRef,
    bannersData,
    bannersError,
    isConnected,
    refetch,
    refetchBanners
  } = useHome()
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
            {bannersError
              ? (
                <SectionErrorCard
                  compact
                  title={t('offers', { defaultValue: 'Offers' })}
                  onRetry={refetchBanners}
                />
                )
              : <HomeBanner banners={bannersData?.banners || []} />}
            {orderConfirmation}
          </>
            )
          : (
          <OfflineBanner currentTheme={currentTheme} t={t} />
            )}
        {error
          ? (
            <SectionErrorCard
              title={t('categories', { defaultValue: 'Categories' })}
              onRetry={refetch}
            />
            )
          : <HorizontalCategoriesList categoriesData={categoriesData} />}
      </View>
    ),
    [isConnected, bannersData, bannersError, orderConfirmation, currentTheme, t, categoriesData, error, refetch, refetchBanners]
  )
  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <FlatList
        data={error ? [] : categoriesData}
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
