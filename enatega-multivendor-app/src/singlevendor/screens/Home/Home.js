import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import sliderImg1 from '../../assets/images/sliderImg1.png'
import styles from './Styles'
import HorizontalProductsList from '../../components/HorizontalProductsList'
import HorizontalCategoriesList from '../../components/HorizontalCategoriesList'

import { drinksData, categoriesData } from '../../assets/dummyData'

const Home = () => {
  return (
    <ScrollView>
      <View style={styles.sliderContainer}>
        <Image source={sliderImg1} style={styles.image} />
      </View>
      <HorizontalProductsList listTitle="Drinks" ListData={drinksData} />
      <HorizontalCategoriesList categoriesData={categoriesData} />
    </ScrollView>
  )
}

export default Home