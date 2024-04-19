import React, { useContext } from 'react'
import { View, ImageBackground } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const Banner = ({banners}) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={3}
      autoplayLoop
      showPagination
      data={banners ?? []}
      paginationStyle={styles().pagination}
      paginationActiveColor={currentTheme.black}
      paginationDefaultColor={currentTheme.hex}
      paginationStyleItemActive={styles().paginationItem}
      paginationStyleItemInactive={styles().paginationItem}
      renderItem={({ item }) => (
        <View style={styles(currentTheme).banner}>
          <ImageBackground
            source={{uri: item.file}}
            resizeMode='cover'
            style={styles().image}
          >
            <View style={styles().container}>
              <TextDefault H3 bolder textColor='#fff' style={{textTransform: 'capitalize'}}>
                {item.title}
              </TextDefault>
              <TextDefault bolder textColor='#fff'>
                {item.description}
              </TextDefault>
            </View>
          </ImageBackground>
        </View>
      )}
    />
  )
}

export default Banner
