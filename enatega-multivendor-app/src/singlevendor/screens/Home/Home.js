import { View, SafeAreaView, Platform, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
// import HomeBanner from '../../components/Home/HomeBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'
import { FlatList } from 'react-native-gesture-handler'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './Styles'
import PromoBanner from '../../components/Profile/PromoBanner'

const Home = () => {
  const { data } = useHome()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  console.log("🚀 ~ Home ~ categoriesData:", categoriesData)
  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <FlatList
        data={categoriesData}
        renderItem={({ item }) => <WrapperHorizontalProductsList data={item} listTitle={item?.name} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => {
          return (
            <View style={{marginTop: 30}}>
             <PromoBanner/>
              <HorizontalCategoriesList categoriesData={categoriesData} />
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}

export default Home
