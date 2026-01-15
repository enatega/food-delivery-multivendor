import { Pressable, TouchableOpacity, View, SafeAreaView, Platform, StatusBar } from 'react-native'
import React, { useLayoutEffect, useRef, useContext } from 'react'

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
import HomeBanner from '../../components/Home/HomeBanner'
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

const Home = () => {
  const { data, currentTheme, t, isLoggedIn, profile, addressIcons, location, setAddressLocation, onOpen, modalRef, bannersData } = useHome()
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
    <View style={styles(currentTheme).addressContainer}>
      <View style={styles(currentTheme).centerTitleContainer}>
        <TextDefault H3 bolder>
          {t('location')}
        </TextDefault>
      </View>

      <TouchableOpacity hitSlop={10} onPress={() => modalRef.current.close()} style={styles(currentTheme).closeButton}>
        <Entypo name='cross' size={22} color={currentTheme?.colorTextMuted} />
      </TouchableOpacity>
    </View>
  )

  const modalFooter = () => (
    <Pressable
      activeOpacity={0.5}
      style={styles(currentTheme).addButton}
      onPress={() => {
        if (isLoggedIn) {
          navigation.navigate('AddAddress', {
            // prevScreen: 'Home',
            // ...location
          })
        } else {
          const modal = modalRef.current
          modal?.close()
          navigation.navigate({
            name: 'CreateAccount'
          })
        }
      }}
    >
      <View style={styles(currentTheme).addressSubContainer}>
        <AntDesign name='plus' size={scale(20)} color={currentTheme.darkBgFont} />
        <View style={styles().mL5p} textColor={currentTheme.black} />
        <TextDefault bold H5 textColor={currentTheme.darkBgFont}>
          {t('addAddress')}
        </TextDefault>
      </View>
    </Pressable>
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
              <HomeBanner banners={bannersData?.banners || []} />
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
