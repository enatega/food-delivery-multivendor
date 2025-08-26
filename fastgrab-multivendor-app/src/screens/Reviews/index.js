import React, { useContext, useLayoutEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { styles } from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import StarRating from '../../assets/SVG/small-star-icon'
import Button from '../../components/Button/Button'
import ReviewCard from '../../components/Review/ReviewCard'
import { GET_REVIEWS_BY_RESTAURANT } from '../../apollo/queries'
import { useQuery, gql } from '@apollo/client'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

import {
  calculateDaysAgo,
  groupAndCount,
  sortReviews
} from '../../utils/customFunctions'

const Review = gql`
  ${GET_REVIEWS_BY_RESTAURANT}
`

const Reviews = ({ navigation, route }) => {
  const { t, i18n } = useTranslation()

  const restaurant = route.params.restaurantObject
  const { restaurantId } = restaurant
  // console.log("restaurant in review page",restaurantId);
  const {
    loading,
    error,
    refetch,
    data: reviewsdata
  } = useQuery(Review, {
    variables: { restaurant: restaurantId || restaurant?._id }
  })
  const rating = reviewsdata?.reviewsByRestaurant.ratings
  const total = reviewsdata?.reviewsByRestaurant.total
  const reviews = reviewsdata?.reviewsByRestaurant.reviews
  const reviewGroups = groupAndCount(
    reviewsdata?.reviewsByRestaurant.reviews,
    'rating'
  )
  // console.log("reviewGroups",reviewGroups)
  const [sortBy, setSortBy] = useState('newest')
  const sortingParams = {
    newest: t('Newest'),
    highest: t('HighestRating'),
    lowest: t('LowestRating')
  }
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <TextDefault H4 bold textColor={currentTheme.newFontcolor}>
            {t('ratingAndreviews')}
          </TextDefault>
          <TextDefault
            H5
            style={{ ...alignment.MTxSmall }}
            textColor={currentTheme.newFontcolor}
          >
            {restaurant.restaurantName}
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={styles.backImageContainer}>
              <MaterialIcons
                name='arrow-back'
                size={30}
                color={currentTheme.newIconColor}
              />
            </View>
          )}
          onPress={() => {
            navigation.goBack()
          }}
        />
      )
    })
  }, [navigation])
  const sorted = reviews && reviews?.length ? sortReviews([...reviews], sortBy) : []


  const calculatePercentages = (groups, total) => {
    // Calculate raw percentages
    const rawPercentages = {}
    let totalInteger = 0

    Object.keys(groups).forEach((key) => {
      const rawValue = (groups[key] / total) * 100
      // Store the raw value and its integer part
      rawPercentages[key] = {
        raw: rawValue,
        integer: Math.floor(rawValue),
        remainder: rawValue - Math.floor(rawValue)
      }
      totalInteger += Math.floor(rawValue)
    })

    // Determine how many points we need to distribute to reach 100%
    const remaining = 100 - totalInteger

    // Sort keys by remainder in descending order to allocate extra points
    const sortedKeys = Object.keys(rawPercentages).sort(
      (a, b) => rawPercentages[b].remainder - rawPercentages[a].remainder
    )

    // Distribute the remaining points to items with largest remainders
    for (let i = 0; i < remaining; i++) {
      if (i < sortedKeys.length) {
        rawPercentages[sortedKeys[i]].integer += 1
      }
    }

    // Create final percentage object
    const finalPercentages = {}
    Object.keys(rawPercentages).forEach((key) => {
      finalPercentages[key] = rawPercentages[key].integer
    })

    return finalPercentages
  }

  // Calculate percentages once before rendering
  const percentages = calculatePercentages(reviewGroups, total)

  const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();
  if (!connect) return <ErrorView refetchFunctions={[refetch]}/>
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.themeBackground }}>
      <ScrollView style={[styles.container]}>
        <View>
          <View
            style={{
              flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              ...alignment.MTsmall,
              ...alignment.MBsmall
            }}
          >
            <TextDefault bold H3 textColor={currentTheme.newFontcolor}>
              {t('allRatings')} ({total ?? '0 Reviews'})
            </TextDefault>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <StarRating />
              <TextDefault bold H3 textColor={currentTheme.newFontcolor}>
                {rating}
              </TextDefault>
            </View>
          </View>
          <View>
            {Object.keys(reviewGroups)
              .sort((a, b) => b - a)
              .map((i, index) => {
                const filled = percentages[i]
                const unfilled = 100 - filled
                return (
                  <View
                    key={`${index}-rate`}
                    style={{
                      flexDirection: currentTheme?.isRTL
                        ? 'row-reverse'
                        : 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      marginVertical: scale(5)
                    }}
                  >
                    <View
                      style={{
                        flexDirection: currentTheme?.isRTL
                          ? 'row-reverse'
                          : 'row',
                        alignItems: currentTheme?.isRTL
                          ? 'flex-start'
                          : 'flex-end'
                      }}
                    >
                      <TextDefault> {i} </TextDefault>
                      <StarRating isFilled={true} />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: currentTheme?.isRTL
                          ? 'row-reverse'
                          : 'row',
                        marginHorizontal: scale(10)
                      }}
                    >
                      <View
                        style={{
                          height: scale(5),
                          width: filled ? `${filled}%` : '0%',
                          backgroundColor: currentTheme.orange
                        }}
                      />
                      <View
                        style={{
                          height: scale(5),
                          width: `${unfilled}%`,
                          backgroundColor: currentTheme.borderLight
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '10%',
                        alignItems: currentTheme?.isRTL
                          ? 'flex-start'
                          : 'flex-end'
                      }}
                    >
                      <TextDefault bolder textColor={currentTheme.gray700}>
                        {filled ? parseInt(filled) : 0}%
                      </TextDefault>
                    </View>
                  </View>
                )
              })}
          </View>
        </View>
        <View style={{ ...alignment.MTsmall }}>
          <TextDefault textColor={currentTheme.gray900} H3 bold isRTL>
            {t('titleReviews')}
          </TextDefault>
          <View
            style={{
              flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
              ...alignment.MTsmall
            }}
          >
            {Object.keys(sortingParams).map((key) => (
              <Button
                key={key}
                textProps={{ textColor: currentTheme.color4 }}
                buttonProps={{ onPress: () => setSortBy(key) }}
                text={sortingParams[key]}
                textStyles={styles.text}
                buttonStyles={{
                  backgroundColor:
                    sortBy === key
                      ? currentTheme.primary
                      : currentTheme.gray200,
                  margin: scale(10),
                  borderRadius: scale(10)
                }}
              />
            ))}
          </View>
          <View style={{ ...alignment.MBlarge }}>
            {sorted.map((review) => (
              <ReviewCard
                key={review._id}
                name={review.order.user.name}
                description={review.description}
                rating={review.rating}
                date={calculateDaysAgo(review.createdAt)}
                theme={currentTheme}
              />
            ))}
          </View>
          <View style={{ ...alignment.MTlarge }}>
            {sorted.length === 0 ? (
              <TextDefault center H4 bold>
                {t('unReadReviews')}
              </TextDefault>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Reviews
