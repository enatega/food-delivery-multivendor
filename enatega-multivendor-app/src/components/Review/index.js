import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import TextDefault from '../Text/TextDefault/TextDefault'
import CrossCirleIcon from '../../assets/SVG/cross-circle-icon'
import { scale } from '../../utils/scaling'
import StarIcon from '../../assets/SVG/star-icon'
import { styles } from './styles'
import Button from '../Button/Button'
import { order } from '../../apollo/queries'
import gql from 'graphql-tag'
import { useApolloClient, useMutation } from '@apollo/client'
import { reviewOrder } from '../../apollo/mutations'
import { useTranslation } from 'react-i18next'
import CachedImage from '../CachedImage'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const BASE_MODAL_HEIGHT = Math.min(Math.floor(SCREEN_HEIGHT * 0.38), 320)
const EXPANDED_MODAL_HEIGHT = Math.min(Math.floor(SCREEN_HEIGHT * 0.72), 560)
const SNAP_HEIGHT = EXPANDED_MODAL_HEIGHT

const ORDER = gql`${order}`
const REVIEWORDER = gql`
  ${reviewOrder}
`

function Review({ onOverlayPress, onSubmitted, theme, orderId, rating }, ref) {

  const { t } = useTranslation()

  const ratingRef = useRef()
  const [description, setDescription] = useState('')
  const [mutate] = useMutation(REVIEWORDER, { variables: { order: orderId, description, rating: ratingRef.current }, onCompleted, onError })
 
  function onCompleted() {
    setDescription('')
    ref?.current?.close()
    onSubmitted?.()
  }
  function onError(error) {
    console.log(JSON.stringify(error))
  }
  const client = useApolloClient()
  const [showSection, setShowSection] = useState(false)
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState()
  const isFeedbackVisible = showSection || rating > 0
  const onSelectRating = (rating) => {
    if (!showSection) { setShowSection(true) }
    ratingRef.current = rating
  }
  const fetchOrder = async() => {
    const result = await client.query({ query: ORDER, variables: { id: orderId } })
    setOrder(result?.data?.order)
  }
  useEffect(() => {
    if (!orderId) return
    fetchOrder()
  }, [orderId])

  const onSubmit = async () => {
    if (loading) return; 
    setLoading(true); 
  
    try {
      await mutate({
        variables: { order: orderId, description, rating: ratingRef.current }
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false); 
    }
  };
  return (
    <Modalize
      snapPoint={SNAP_HEIGHT}
      modalHeight={isFeedbackVisible ? EXPANDED_MODAL_HEIGHT : BASE_MODAL_HEIGHT}
      handlePosition='inside'
      ref={ref}
      withHandle={false}
      adjustToContentHeight={false}
      keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardAvoidingOffset={Platform.OS === 'ios' ? 24 : 0}
      modalStyle={{ borderWidth: StyleSheet.hairlineWidth }}
      onOverlayPress={onOverlayPress}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container(theme)}
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content(theme)}
        >
          <View style={styles.headingContainer(theme)}>
            <TextDefault bolder H3 textColor={theme.gray900}>
              {t('howWasOrder')}
            </TextDefault>
            <TouchableOpacity onPress={onCompleted}>
              <CrossCirleIcon stroke={theme.newIconColor}/>
            </TouchableOpacity>
          </View>
          <View style={styles.itemContainer(theme)}>
            <View style={styles.summaryTextWrap}>
              {order?.items?.slice(0, 2).map((item, index) => (
                <TextDefault
                  key={`${item.food}-${index}`}
                  H5
                  bold
                  textColor={theme.gray900}
                  isRTL
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {item.title}
                </TextDefault>
              ))}
              <View>
                {order?.deliveredAt && (
                  <TextDefault
                    textColor={theme.gray500}
                    isRTL
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {new Date(order?.deliveredAt).toString()}
                  </TextDefault>
                )}
              </View>
            </View>
            <View>
              <CachedImage source={order?.restaurant?.image ? { uri: order?.restaurant?.image }: require('../../assets/images/food_placeholder.png') } style={styles.image}/>
            </View>
          </View>

          <View style={styles.starRow}>
            <StarRating numberOfStars={5} onSelect={onSelectRating} defaultRating={rating} theme={theme} />
          </View>

          {isFeedbackVisible && (
            <View style={styles.feedbackSection}>
              <TextDefault textColor={theme.gray900} H4 bolder style={{ marginVertical: scale(8) }} isRTL>
                {t('tellAboutExp')} {order?.restaurant?.name}
              </TextDefault>
              <TextInput
                placeholder={t('typeHere')}
                placeholderTextColor={theme.placeholderColor}
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
                textAlignVertical='top'
                scrollEnabled
                style={styles.modalInput(theme)}
              />
              <Button
                text={t('submit')}
                buttonProps={{ onPress: onSubmit, disabled: loading }}
                buttonStyles={{
                  borderRadius: 15,
                  backgroundColor: theme.primary,
                  marginTop: scale(12),
                  opacity: loading ? 0.6 : 1
                }}
                textStyles={{ marginVertical: scale(10), alignSelf: 'center' }}
                textProps={{ H4: true, bold: true, textColor: theme.black }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modalize>
  )
}

const StarRating = ({ numberOfStars = 5, onSelect, defaultRating=0, theme }) => {
  const stars = Array.from({ length: numberOfStars }, (_, index) => index + 1)
  const [selected, setSelected] = useState(defaultRating)
  useEffect(()=>{
    if(defaultRating) onSelect(defaultRating)
  },[])
  const onPress = index => {
    onSelect(index)
    setSelected(index)
  }
  return (
    <View style={styles.starContainer(theme)}>
      {stars.map(index => <TouchableWithoutFeedback key={`star-${index}`} onPress={() => onPress(index)}>
        <View style={{ flex: 1 }}>
          <StarIcon isFilled={index <= selected}/>
        </View>
      </TouchableWithoutFeedback>)}
    </View>
  )
}

export default forwardRef(Review)
