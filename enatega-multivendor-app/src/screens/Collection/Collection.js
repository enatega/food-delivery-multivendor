import React, { useContext, useLayoutEffect } from 'react'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { View, TouchableOpacity, FlatList, Image } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import styles from './styles'

const HEADING = {
  Restaurants: 'I feel like eating',
  Store: 'Lets shop for',
  default: 'Collections'
}

const Collection = ({ navigation, route }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const data = route?.params?.data ?? []
  const collectionType = route?.params?.collectionType ?? 'default'

  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        navigation,
        headerMenuBackground: currentTheme.headerMenuBackground
      })
    )
  }, [navigation, currentTheme])

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault bolder H2>
        {HEADING[collectionType]}
      </TextDefault>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).collectionCard}
              onPress={()=>{
                navigation.navigate(collectionType ??  "Restaurants", { collection : item.name})
              }}
            >
              <View style={styles().brandImgContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles().collectionImage}
                  resizeMode='cover'
                />
              </View>
              <TextDefault Normal bold style={{ padding: 8 }}>
                {item.name}
              </TextDefault>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item) => item?._id}
        contentContainerStyle={styles().contentContainerStyle}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles().columnWrapperStyle}
        numColumns={2}
      />
    </View>
  )
}

export default Collection
