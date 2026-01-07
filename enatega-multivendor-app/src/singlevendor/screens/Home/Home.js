import { Pressable, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useRef } from 'react'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
import HomeBanner from '../../components/Home/HomeBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import navigationOptions from './navigationOptions'
import MainModalize from '../../../components/Main/Modalize/MainModalize'
import styles from './Styles'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'

const Home = () => {
  const { data, currentTheme, t, isLoggedIn, profile, addressIcons, location, setAddressLocation, onOpen, modalRef } = useHome()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor

  const navigation = useNavigation()

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
          props?.navigation.navigate({
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
    <>
      <FlatList
        data={categoriesData}
        renderItem={({ item }) => <WrapperHorizontalProductsList data={item} listTitle={item?.name} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => {
          return (
            <>
              <HomeBanner />
              <HorizontalCategoriesList categoriesData={categoriesData} />
            </>
          )
        }}
      />

      <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
    </>
  )
}

export default Home
