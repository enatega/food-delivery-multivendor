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
import ErrorView from '../../components/ErrorView/ErrorView'
import EmptyView from '../../components/EmptyView/EmptyView'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import { isOpen, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'

import useNetworkStatus from '../../utils/useNetworkStatus'


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
      fetchPolicy: 'network-only',
      errorPolicy: "all"
    }
  )
  useEffect(() => {
    if(data && data.userFavourite) {
  console.log(JSON.stringify(data, null, 2), 'FavouriteRestaurantsData')
    }
  },[data])
 
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_FAVOURITES)
    }
    Track()
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    if(error){
      console.error('Error fetching favourite restaurants:', error)
    }
  }, [error]) 

  useEffect(() => {
    navigation.setOptions({
      title: t('titleFavourite'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color:currentTheme.newFontcolor,
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
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color={currentTheme.newFontcolor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

    
    const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();
    if (!connect) return <ErrorView refetchFunctions={[refetch]} />

  const emptyView = () => {
    return (
      <EmptyView
        title={'titleEmptyFav'}
        description={'emptyFavDesc'}
        buttonText={'emptyFavBtn'}
      />
    )
  }

  if (loading)
    return (
      <Spinner
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    )
  if (error) return <ErrorView />

const favouriteRestaurants = data?.userFavourite?.filter(item => item !== null) || []
console.log('Favourite Restaurants:', favouriteRestaurants)
  return (
    <SafeAreaView edges={['bottom']} style={styles(currentTheme).flex}>
      <FlatList
        data={favouriteRestaurants}
        keyExtractor={(item, index) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={networkStatus === 4}
        onRefresh={() => networkStatus === 7 && refetch()}
        // style={[styles().flex, styles(currentTheme).container]}
        contentContainerStyle={styles(currentTheme).contentContainer}
        ListEmptyComponent={emptyView()}
        ListHeaderComponent={null}
        renderItem={({ item }) => {
  if (!item) return null // skip nulls

  return (
    <NewRestaurantCard
      {...item}
      reviewAverage={item.reviewAverage}
      reviewCount={item.reviewCount}
      isCategories
      fullWidth
      isOpen={true}
      isAvailable={item.isAvailable || true}
    />
  )
}}
      />
    </SafeAreaView>
  )
}

export default Favourite
