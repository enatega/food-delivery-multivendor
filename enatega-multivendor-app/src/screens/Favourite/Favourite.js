import { useQuery } from '@apollo/client'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import gql from 'graphql-tag'
import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import i18n from '../../../i18n'
import { FavouriteRestaurant } from '../../apollo/queries'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import Item from '../../components/Main/Item/Item'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import TextError from '../../components/Text/TextError/TextError'
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import screenOptions from './screenOptions'
import styles from './styles'
import analytics from '../../utils/analytics'
const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`

function Favourite() {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null
      },
      fetchPolicy: 'network-only'
    }
  )
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_FAVOURITES)
    }
    Track()
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions(currentTheme.headerText))
  }, [navigation])
  function emptyView() {
    return (
      <View style={[styles().flex, styles(currentTheme).mainContainerEmpty]}>
        <View style={styles().subContainerImage}>
          <View style={styles().imageContainer}>
            <EmptyCart width={scale(200)} height={scale(200)} />
          </View>
          <View style={styles().descriptionEmpty}>
            <TextDefault textColor={currentTheme.fontMainColor} bolder center>
              {i18n.t('titleEmptyFav')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} center>
              {i18n.t('emptyFavDesc')}
            </TextDefault>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={() =>
              navigation.navigate({
                name: 'Main',
                merge: true
              })
            }>
            <TextDefault
              textColor={currentTheme.buttonText}
              bolder
              B700
              center
              uppercase>
              {i18n.t('emptyFavBtn')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) return <Spinner />
  if (error) return <TextError text={error.message} />
  return (
    <SafeAreaView edges={['bottom']} style={styles().flex}>
      <FlatList
        data={data ? data.userFavourite : []}
        keyExtractor={(item, index) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={networkStatus === 4}
        onRefresh={() => networkStatus === 7 && refetch()}
        style={[styles().flex, styles(currentTheme).container]}
        contentContainerStyle={styles().contentContainer}
        ListEmptyComponent={emptyView()}
        ListHeaderComponent={null}
        renderItem={({ item }) => <Item item={item} />}
      />
    </SafeAreaView>
  )
}

export default Favourite
