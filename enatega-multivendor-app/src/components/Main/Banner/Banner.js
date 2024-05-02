import React, { useContext } from 'react'
import { View, ImageBackground, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { useNavigation } from '@react-navigation/native'

const Banner = ({ banners }) => {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const onPressBanner = (banner) => {
    const parameters = JSON.parse(banner.parameters)
    const selectedType = parameters[0]?.value
    const queryType = parameters[1]?.value

    navigation.navigate(
      navigation
        .getState()
        .routeNames.includes(banner.screen)  ? banner.screen : 'Menu',
      {
        selectedType: selectedType ?? 'restaurant',
        queryType: queryType ?? 'restaurant'
      }
    )
  }

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      showPagination
      data={banners ?? []}
      paginationStyle={styles().pagination}
      paginationActiveColor={currentTheme.main}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={styles().paginationItem}
      paginationStyleItemInactive={styles().paginationItem}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles(currentTheme).banner}
          activeOpacity={0.9}
          onPress={() => onPressBanner(item)}
        >
          <ImageBackground
            source={{ uri: item.file }}
            resizeMode='cover'
            style={styles().image}
          >
            <View style={styles().container}>
              <TextDefault
                H3
                bolder
                textColor='#fff'
                style={{ textTransform: 'capitalize' }}
              >
                {item.title}
              </TextDefault>
              <TextDefault bolder textColor='#fff'>
                {item.description}
              </TextDefault>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
    />
  )
}

export default Banner
