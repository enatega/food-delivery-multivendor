import React, { useContext, useLayoutEffect } from 'react'
import { View, FlatList, Image } from 'react-native'
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import Ripple from 'react-native-material-ripple'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const HEADING = {
  Restaurants: 'I feel like eating',
  Store: 'Lets shop for',
  default: 'Collections'
}

// ✅ Use Reanimated Animated.View directly in renderItem
const AnimatedItem = ({ index, item, navigation, collectionType, themeStyles }) => (
  <Animated.View entering={FadeInUp.delay(index * 80).duration(500)} style={{ flex: 0.5, marginHorizontal: 5, marginVertical: 2 }}>
    <Ripple
      activeOpacity={0.7}
      style={themeStyles.collectionCard}
      onPress={() =>
        navigation.navigate(collectionType ?? 'Restaurants', {
          collection: item?.name
        })
      }
    >
      <View style={styles().brandImgContainer}>
        <Image source={{ uri: item?.image }} style={styles().collectionImage} resizeMode='cover' />
      </View>
      <TextDefault Normal bold style={{ padding: 8 }} isRTL>
        {item.name}
      </TextDefault>
    </Ripple>
  </Animated.View>
)

const Collection = ({ navigation, route }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const data = route?.params?.data ?? []
  const collectionType = route?.params?.collectionType ?? 'default'
  const { t } = useTranslation()

  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        navigation,
        headerMenuBackground: currentTheme.headerMenuBackground,
        backIconColor: currentTheme.newIconColor
      })
    )
  }, [navigation, currentTheme])

  const { isConnected } = useNetworkStatus()
  if (!isConnected) return <ErrorView refetchFunctions={[]} />

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault bolder H2 isRTL>
        {t(HEADING[collectionType])}
      </TextDefault>

      <FlatList numColumns={2} data={data} keyExtractor={(item) => item?._id} renderItem={({ item, index }) => <AnimatedItem index={index} item={item} navigation={navigation} collectionType={collectionType} themeStyles={styles(currentTheme)} />} ItemSeparatorComponent={() => <View style={{ width: 20 }} />} contentContainerStyle={styles().contentContainerStyle} showsVerticalScrollIndicator={false} columnWrapperStyle={styles().columnWrapperStyle} />
    </View>
  )
}

export default Collection
