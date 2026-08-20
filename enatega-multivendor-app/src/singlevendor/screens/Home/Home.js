import { View, Platform, StatusBar, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import SelectedLocation from '../../../components/Main/Location/Location'
import RestaurantScheduleTime from '../../components/RestaurantScheduleTime/RestaurantScheduleTime'
import DiscoveryDeals from '../../components/Home/DiscoveryDeals'
import { HomeBannerSkeleton, HomeCategoriesSkeleton } from '../../components/Home/HomeSectionSkeletons'

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
    loading,
    bannersData,
    bannersLoading,
    bannersError,
    isConnected,
    refetch,
    refetchBanners
  } = useHome()
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refetch])
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
    if (Platform.OS === 'android') return

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

  const androidHeader = Platform.OS === 'android'
    ? (
      <View
        style={[
          styles(currentTheme).androidHeader,
          {
            borderBottomColor:
              currentTheme.newBorderColor2 ||
              currentTheme.colorBorder ||
              currentTheme.horizontalLine ||
              'rgba(148, 163, 184, 0.28)'
          }
        ]}
      >
        <View style={styles(currentTheme).androidAddress}>
          <SelectedLocation
            modalOn={onOpen}
            navigation={navigation}
          />
        </View>
        <View style={styles(currentTheme).androidScheduleOverlay}>
          <RestaurantScheduleTime />
        </View>
      </View>
      )
    : null

  const modalHeader = () => <AddressModalHeader onClose={() => modalRef.current.close()}></AddressModalHeader>

  const modalFooter = () => <AddressModalFooter onClose={() => modalRef.current.close()}></AddressModalFooter>

  const orderConfirmation = useMemo(() => <OrderConfirmation isHome={true} />, [])
  const listHeader = useMemo(
    () => (
      <View style={styles(currentTheme).listHeader}>
        {isConnected
          ? (
          <>
            {bannersLoading && !bannersData?.banners?.length
              ? <HomeBannerSkeleton />
              : bannersError
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
        {loading && !categoriesData.length
          ? <HomeCategoriesSkeleton />
          : error
            ? (
            <SectionErrorCard
              title={t('categories', { defaultValue: 'Categories' })}
              onRetry={refetch}
            />
              )
            : <HorizontalCategoriesList categoriesData={categoriesData} />}
        <DiscoveryDeals />
      </View>
    ),
    [isConnected, bannersData, bannersLoading, bannersError, orderConfirmation, currentTheme, t, categoriesData, loading, error, refetch, refetchBanners]
  )
  return (
    <SafeAreaView
      edges={Platform.OS === 'android' ? ['top', 'left', 'right'] : ['left', 'right']}
      style={styles(currentTheme).container}
    >
      {androidHeader}
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
