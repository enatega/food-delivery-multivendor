import React, { useContext, useLayoutEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { styles } from './styles'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import StarRating from '../../assets/SVG/small-star-icon'
import Button from '../../components/Button/Button'
import ReviewCard from '../../components/Review/ReviewCard'
import Spinner from '../../components/Spinner/Spinner'
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
  const filterOptions = [
    { key: 'newest', label: sortingParams.newest },
    { key: 'highest', label: sortingParams.highest },
    { key: 'lowest', label: sortingParams.lowest }
  ]
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
  }, [navigation, currentTheme, t, restaurant.restaurantName])
  const sorted = reviews && reviews?.length ? sortReviews([...reviews], sortBy) : []


  const calculatePercentages = (groups, total) => {
    if (!total || total <= 0) {
      return Object.keys(groups || {}).reduce((acc, key) => {
        acc[key] = 0
        return acc
      }, {})
    }

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

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[refetch]} />
  if (loading) {
    return (
      <Spinner
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.primary}
      />
    )
  }
  if (error) return <ErrorView refetchFunctions={[refetch]} />
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.themeBackground }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: currentTheme.themeBackground }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionSpacing}>
          <View
            style={[
              styles.summaryRow,
              {
                flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
              }
            ]}
          >
            <TextDefault bold H3 textColor={currentTheme.newFontcolor}>
              {t('allRatings')} ({total ?? '0 Reviews'})
            </TextDefault>
            <View style={styles.ratingValueRow}>
              <StarRating />
              <TextDefault
                bold
                H3
                textColor={currentTheme.newFontcolor}
                style={styles.ratingValueText}
              >
                {rating}
              </TextDefault>
            </View>
          </View>
          <View style={styles.ratingBreakdownSection}>
            {Object.keys(reviewGroups)
              .sort((a, b) => b - a)
              .map((i, index) => {
                const filled = percentages[i]
                const unfilled = 100 - filled
                return (
                  <View
                    key={`${index}-rate`}
                    style={[
                      styles.ratingBreakdownRow,
                      {
                        flexDirection: currentTheme?.isRTL
                          ? 'row-reverse'
                          : 'row'
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.ratingLabelContainer,
                        {
                          flexDirection: currentTheme?.isRTL
                            ? 'row-reverse'
                            : 'row'
                        }
                      ]}
                    >
                      <TextDefault style={styles.ratingLabel}>{i}</TextDefault>
                      <StarRating isFilled={true} />
                    </View>
                    <View style={styles.ratingBarTrack}>
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
                        minWidth: scale(34),
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
        <View style={styles.reviewsSection}>
          <TextDefault textColor={currentTheme.gray900} H3 bold isRTL>
            {t('titleReviews')}
          </TextDefault>
          <View
            style={[
              styles.filtersRow,
              {
                flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
              }
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={[
                styles.filtersContent,
                {
                  flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
                }
              ]}
            >
              {filterOptions.map((item, index) => (
                <Button
                  key={item.key}
                  textProps={{
                    textColor: currentTheme.color4,
                    numberOfLines: 1,
                    adjustsFontSizeToFit: true,
                    minimumFontScale: 0.82
                  }}
                  buttonProps={{ onPress: () => setSortBy(item.key) }}
                  text={item.label}
                  textStyles={styles.filterText}
                  buttonStyles={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        sortBy === item.key
                          ? currentTheme.primary
                          : currentTheme.gray200,
                      marginRight:
                        index === filterOptions.length - 1
                          ? 0
                          : scale(10)
                    }
                  ]}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.reviewsList}>
            {sorted.map((review) => (
              <ReviewCard
                key={review._id}
                name={review.order?.user?.name}
                description={review.description}
                rating={review.rating}
                date={calculateDaysAgo(review.createdAt)}
                theme={currentTheme}
              />
            ))}
          </View>
          <View style={styles.emptyStateContainer}>
            {sorted.length === 0 ? (
              <View
                style={[
                  styles.emptyStateCard,
                  {
                    backgroundColor: currentTheme.cardBackground,
                    borderColor: currentTheme.borderLight
                  }
                ]}
              >
                <View
                  style={[
                    styles.emptyStateIllustration,
                    { backgroundColor: currentTheme.gray200 }
                  ]}
                >
                  <MaterialIcons
                    name='rate-review'
                    size={scale(42)}
                    color={currentTheme.primary}
                  />
                  <View style={styles.emptyStateBadge}>
                    <StarRating isFilled />
                  </View>
                </View>
                <TextDefault
                  center
                  H3
                  bold
                  textColor={currentTheme.gray900}
                  style={styles.emptyStateTitle}
                >
                  {t('noReviewsYet', 'No Reviews Yet')}
                </TextDefault>
                <TextDefault
                  center
                  H5
                  textColor={currentTheme.gray500}
                  style={styles.emptyStateDescription}
                >
                  {t(
                    'noReviewsYetDescription',
                    'Once reviews are shared, they will appear here.'
                  )}
                </TextDefault>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Reviews
