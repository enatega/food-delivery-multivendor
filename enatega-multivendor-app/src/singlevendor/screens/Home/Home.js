import { Pressable, TouchableOpacity, View, SafeAreaView, Platform, StatusBar } from 'react-native'
import React, { useLayoutEffect, useRef, useContext } from 'react'

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
// import HomeBanner from '../../components/Home/HomeBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'
import { FlatList } from 'react-native-gesture-handler'

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

const Home = () => {
  const { data, currentTheme, t, isLoggedIn, profile, addressIcons, location, setAddressLocation, onOpen, modalRef } = useHome()
  const {} = useCart()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor

  const navigation = useNavigation()

  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  console.log('🚀 ~ Home ~ categoriesData:', categoriesData)

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

  const modalHeader = () => (
    <AddressModalHeader onClose={() => modalRef.current.close()}></AddressModalHeader>
  )

  const modalFooter = () => (
   
    <AddressModalFooter onClose={() => modalRef.current.close()}></AddressModalFooter>
  )

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <FlatList
        data={categoriesData}
        renderItem={({ item }) => <WrapperHorizontalProductsList data={item} listTitle={item?.name} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => {
          return (
            <View style={{ marginTop: 30 }}>
              <PromoBanner />
              <HorizontalCategoriesList categoriesData={categoriesData} />
            </View>
          )
        }}
      />

      <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
    </SafeAreaView>
  )
}

export default Home
