import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
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

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)
const SNAP_HEIGHT = MODAL_HEIGHT

const ORDER = gql`${order}`
const REVIEWORDER = gql`
  ${reviewOrder}
`

function Review({ onOverlayPress, theme, orderId, rating }, ref) {
  const { t } = useTranslation()

  const ratingRef = useRef()
  const [description, setDescription] = useState('')
  const [mutate] = useMutation(REVIEWORDER, { variables: { order: orderId, description, rating: ratingRef.current }, onCompleted, onError })

  function onCompleted() {
    setDescription('')
    ref?.current?.close()
  }
  function onError(error) {
    console.log(JSON.stringify(error))
  }
  const client = useApolloClient()
  const [showSection, setShowSection] = useState(false)
  const [order, setOrder] = useState()
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

  const onSubmit = () => {
    mutate({variables: { order: orderId, description, rating: ratingRef.current }})
  }
  return (
    <Modalize snapPoint={SNAP_HEIGHT} handlePosition='inside' ref={ref} withHandle={false} adjustToContentHeight modalStyle={{ borderWidth: StyleSheet.hairlineWidth }} onOverlayPress={onOverlayPress}>
      <View style={styles.container(theme)}>
        <View style={styles.headingContainer}>
          <TextDefault bolder H3 textColor={theme.gray900}>
            {t('howWasOrder')}
          </TextDefault>
          <TouchableOpacity onPress={onCompleted}>
            <CrossCirleIcon stroke={theme.newIconColor}/>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContainer}>
          <View style={{ justifyContent: 'space-evenly' }}>
            {order?.items?.slice(0, 2).map((item, index) => (<TextDefault key={`${item.food}-${index}`} H5 bold textColor={theme.gray900}>{item.title}</TextDefault>))}
            <View>
              {order?.deliveredAt && <TextDefault textColor={theme.gray500} >{(new Date(order?.deliveredAt).toString())}</TextDefault>}
            </View>
          </View>
          <View>
            <Image source={order?.restaurant?.image ? { uri: order?.restaurant?.image }: require('../../assets/images/food_placeholder.png') } style={styles.image}/>

          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <StarRating numberOfStars={5} onSelect={onSelectRating} defaultRating={rating}/>
        </View>

        {(showSection || rating>0) && <View>
          <TextDefault textColor={theme.gray900} H4 bolder style={{ marginVertical: scale(8) }}>{t('tellAboutExp')} {order?.restaurant?.name}</TextDefault>
          {/* <OutlinedTextField
            label={t('review')}
            placeholder={t('typeHere')}
            fontSize={scale(12)}
            maxLength={200}
            textAlignVertical="top"
            baseColor={theme.verticalLine}
            multiline={true}
            onChangeText={setDescription}
            placeholderTextColor={theme.newFontcolor}
            textColor={theme.newFontcolor}
          /> */}
          <TextInput
            label={t('review')}
            placeholder={t('typeHere')}
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.modalInput(theme)}
          />
          <Button text={t('submit')}
            buttonProps={{ onPress: onSubmit }}
            buttonStyles={{ borderRadius: 15, backgroundColor: theme.primary, margin: 10 }} textStyles={{ margin: 10, alignSelf: 'center' }}
            textProps={{ H4: true, bold: true, textColor: theme.black }}/>
        </View>}
      </View>
    </Modalize>
  )
}

const StarRating = ({ numberOfStars = 5, onSelect, defaultRating=0 }) => {
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
    <View style={styles.starContainer}>
      {stars.map(index => <TouchableWithoutFeedback key={`star-${index}`} onPress={() => onPress(index)}>
        <View style={{ flex: 1 }}>
          <StarIcon isFilled={index <= selected}/>
        </View>
      </TouchableWithoutFeedback>)}
    </View>
  )
}

export default forwardRef(Review)
