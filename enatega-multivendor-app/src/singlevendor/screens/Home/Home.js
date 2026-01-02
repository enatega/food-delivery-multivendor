import { View } from 'react-native'
import React from 'react'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'
// import HomeBanner from '../../components/Home/HomeBanner'
import useHome from './useHome'
import WrapperHorizontalProductsList from '../../components/WrapperHorizontalProductsList'
import { FlatList } from 'react-native-gesture-handler'
import PromoBanner from '../../components/Profile/PromoBanner'

const Home = () => {
  const { data } = useHome()
  const categoriesData = data?.getRestaurantCategoriesSingleVendor
  console.log("🚀 ~ Home ~ categoriesData:", categoriesData)
  return (
    <View>
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
    </View>
  )
}

export default Home
