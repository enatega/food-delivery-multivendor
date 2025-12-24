import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'


import HorizontalProductsList from '../../components/HorizontalProductsList'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'

import { drinksData, categoriesData } from '../../assets/dummyData'
import HomeBanner from '../../components/Home/HomeBanner'

const Home = () => {
  return (
    <ScrollView>
      <HomeBanner></HomeBanner>
      <HorizontalProductsList listTitle='Drinks' ListData={drinksData} />
      <HorizontalCategoriesList categoriesData={categoriesData} />
    </ScrollView>
  )
}

export default Home
