import React, { useContext } from 'react'
import { View, ImageBackground } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const DATA = [1, 2, 3, 4, 5, 6, 7]

const Banner = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      showPagination
      data={DATA}
      paginationStyle={styles().pagination}
      paginationActiveColor={currentTheme.black}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={styles().paginationItem}
      paginationStyleItemInactive={styles().paginationItem}
      renderItem={({ item }) => (
        <View style={styles(currentTheme).banner}>
          <ImageBackground
            source={require('../../../assets/images/ItemsList/coverBreakfast.jpg')}
            resizeMode='cover'
            style={styles().image}
          >
            <View style={styles().container}>
              <TextDefault H3 bolder textColor='#fff'>
                Meet the new eat
              </TextDefault>
              <TextDefault bolder textColor='#fff'>
                Come check our new restaurants! {item}
              </TextDefault>
            </View>
          </ImageBackground>
        </View>
      )}
    />
  )
}

export default Banner
