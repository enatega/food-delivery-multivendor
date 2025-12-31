import { View } from 'react-native'
import React, { useEffect } from 'react'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
import HomeBanner from '../../components/Home/HomeBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'
import { FlatList } from 'react-native-gesture-handler'
import { requestBluetoothPermissions } from '../../utils/thermalPrinter'
import ThermalPrintExample from '../../components/ThermalPrintExample'

const Home = () => {
  const { data } = useHome()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor
  console.log('🚀 ~ Home ~ categoriesData:', categoriesData)

  useEffect(() => {
    requestBluetoothPermissions()
  }, [])
  return (
    <View>
      {/* <FlatList data={categoriesData} renderItem={({ item }) => <WrapperHorizontalProductsList data={item} listTitle={item?.name} />} keyExtractor={(item) => item.id} ListHeaderComponent={<HomeBanner />} ListFooterComponent={<HorizontalCategoriesList categoriesData={categoriesData} />} /> */}
      <ThermalPrintExample />
    </View>
  )
}

export default Home
