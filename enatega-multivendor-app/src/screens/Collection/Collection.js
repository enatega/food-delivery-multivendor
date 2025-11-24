import React, { useContext, useLayoutEffect } from 'react'
import { View, FlatList, Image, Animated, TouchableOpacity } from 'react-native'
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

// CustomItem component to handle animation
const CustomItem = ({ index, children }) => {
  const scaleValue = new Animated.Value(0)

  React.useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      delay: index * 130,
      useNativeDriver: true // Use native driver for better performance
    }).start()
  }, [index])

  return (
    <Animated.View
      style={{
        opacity: 1,
        flex: 1 / 2,
        marginHorizontal: 5,
        marginVertical: 2
      }}
    >
      {children}
    </Animated.View>
  )
}

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

  const { isConnected: connect, setIsConnected: setConnect } =
    useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />
  return (
    <View style={styles(currentTheme).container}>
      <TextDefault bolder H2 isRTL>
        {t(HEADING[collectionType])}
      </TextDefault>
      <FlatList
        numColumns={2}
        data={data ?? []}
        renderItem={({ item, index }) => (
          <CustomItem index={index}>
            <Ripple
              activeOpacity={0.7}
              style={styles(currentTheme).collectionCard}
              onPress={() => {
                navigation.navigate(collectionType ?? 'Restaurants', {
                  collection: item?.name
                })
              }}
            >
              <View style={styles().brandImgContainer}>
                <Image
                  source={{ uri: item?.image }}
                  style={styles().collectionImage}
                  resizeMode='cover'
                />
              </View>
              <TextDefault Normal bold style={{ padding: 8 }} isRTL>
                {item.name}
              </TextDefault>
            </Ripple>
          </CustomItem>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        keyExtractor={(item) => item?._id}
        contentContainerStyle={styles().contentContainerStyle}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles().columnWrapperStyle}
      />
    </View>
  )
}

export default Collection
