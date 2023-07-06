import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import gql from 'graphql-tag'
import Spinner from '../../components/Spinner/Spinner'
import ImageHeader from '../../components/CustomizeComponents/ImageHeader/ImageHeader'
import styles from './styles'
import { reviewOrder } from '../../apollo/mutations'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import i18n from '../../../i18n'
import StarRating from 'react-native-star-rating'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { EvilIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import Analytics from '../../utils/analytics'
// constants
const REVIEWORDER = gql`
  ${reviewOrder}
`

function RateAndReview(props) {
  const [id] = useState(props.route.params._id ?? null)
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()

  const [mutate, { loading: loadingMutation }] = useMutation(REVIEWORDER, {
    onError,
    onCompleted
  })
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: i18n.t('rateAndReview'),
      headerRight: null
    })
  }, [props.navigation])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_RATEANDREVIEW)
    }
    Track()
  }, [])
  function onFinishRating(rating) {
    setRating(rating)
  }

  function onChangeText(description) {
    setDescription(description)
  }

  function onSubmit() {
    mutate({
      variables: {
        order: id,
        rating: rating,
        description: description
      }
    })
  }

  function onCompleted(data) {
    props.navigation.goBack()
  }

  function onError(error) {
    console.log(JSON.stringify(error))
    FlashMessage({
      message: error.networkError.result.errors[0].message
    })
  }

  return (
    <>
      <View
        style={[
          styles().flex,
          { backgroundColor: currentTheme.themeBackground }
        ]}>
        <ImageHeader image={props.route.params.restaurant.image} />
        <View style={styles().reviewTextContainer}>
          <View style={styles().reviewTextSubContainer}>
            <View style={styles().reviewTextContainerText}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                H3
                bolder
                style={styles().reviewText}>
                How was your meal?
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} H5>
                Was it nice or bad,Lets talk about it
              </TextDefault>
            </View>
          </View>
        </View>
        <View style={styles().ratingContainer}>
          <View style={styles().ratingSubContainer}>
            <StarRating
              emptyStarColor={currentTheme.startColor}
              fullStarColor={currentTheme.startOutlineColor}
              disabled={false}
              maxStars={5}
              rating={rating}
              selectedStar={onFinishRating}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'black',
            height: 0.5,
            width: '90%',
            alignSelf: 'center'
          }}></View>

        <TextDefault
          textColor={currentTheme.fontMainColor}
          H3
          bolder
          style={{ padding: 20, marginTop: 20 }}>
          Tell about your Experience
        </TextDefault>
        <View style={styles().inputContainer}>
          <View style={styles(currentTheme).inputSubContainer}>
            <TextInput
              style={[
                styles().textinput,
                { color: currentTheme.fontMainColor }
              ]}
              placeholderTextColor={currentTheme.fontSecondColor}
              onChangeText={onChangeText}
              labelFontSize={scale(6)}
              multiline={true}
              fontSize={scale(12)}
              labelHeight={10}
              maxLength={144}
              placeholder={i18n.t('reviewPlaceholder')}
            />
          </View>
        </View>
        <View style={styles().btnContainer}>
          <View style={styles().btnSubContainer}>
            {loadingMutation && <Spinner />}
            {!loadingMutation && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onSubmit}
                style={styles(currentTheme).btnTouch}>
                <TextDefault textColor={currentTheme.buttonText} H3 bold>
                  {i18n.t('submit')}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}
export default RateAndReview
