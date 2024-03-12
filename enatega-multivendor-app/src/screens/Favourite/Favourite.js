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
import Analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import navigationService from '../../routes/navigationService'

const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`

function Favourite() {
  const analytics = Analytics()

  const { t } = useTranslation()
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
      StatusBar.setBackgroundColor(currentTheme.white)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    navigation.setOptions({
      title: t('titleFavourite'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: '#000',
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.white,
        elevation: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

  function emptyView() {
    return (
      <View style={[styles().flex, styles(currentTheme).mainContainerEmpty]}>
        <View style={styles().subContainerImage}>
          <View style={styles().imageContainer}>
            <EmptyCart width={scale(200)} height={scale(200)} />
          </View>
          <View style={styles().descriptionEmpty}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              center
              B700>
              {t('titleEmptyFav')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} center>
              {t('emptyFavDesc')}
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
              textColor={currentTheme.black}
              bolder
              B700
              center
              uppercase>
              {t('emptyFavBtn')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) return <Spinner />
  if (error) return <TextError text={error.message} />
  return (
    <SafeAreaView edges={['bottom']} style={styles(currentTheme).flex}>
      <FlatList
        data={data ? data.userFavourite : []}
        keyExtractor={(item, index) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={networkStatus === 4}
        onRefresh={() => networkStatus === 7 && refetch()}
        style={[styles().flex, styles(currentTheme).container]}
        contentContainerStyle={styles(currentTheme).contentContainer}
        ListEmptyComponent={emptyView()}
        ListHeaderComponent={null}
        renderItem={({ item }) => <Item item={item} />}
      />
    </SafeAreaView>
  )
}

export default Favourite
