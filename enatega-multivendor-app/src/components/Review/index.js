import React, { forwardRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { OutlinedTextField } from 'react-native-material-textfield'
import TextDefault from '../Text/TextDefault/TextDefault'
import CrossCirleIcon from '../../assets/SVG/cross-circle-icon'
import { scale } from '../../utils/scaling'
import StarIcon from '../../assets/SVG/star-icon'
import { styles } from './styles'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)
const SNAP_HEIGHT = MODAL_HEIGHT

function Review({ onOverlayPress, theme }, ref) {
  const [showSection, setShowSection] = useState(false)
  const onSelectRating = (rating) => {
    setShowSection(true)
    console.log('onSelectRating', rating)
  }
  return (
    <Modalize snapPoint={SNAP_HEIGHT} handlePosition='inside' ref={ref} withHandle={false} adjustToContentHeight modalStyle={{ borderWidth: StyleSheet.hairlineWidth }} onOverlayPress={onOverlayPress}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <TextDefault bolder H3 textColor={theme.gray900}>
            {'How was your order?'}
          </TextDefault>
          <CrossCirleIcon/>
        </View>
        <View style={styles.itemContainer}>
          <View style={{ justifyContent: 'space-evenly' }}>
            <TextDefault H5 bold textColor={theme.gray900}>Signature Double</TextDefault>
            <TextDefault H5 bold textColor={theme.gray900}>Decker Burger</TextDefault>
            <TextDefault H5 textColor={theme.gray500}>Thu, 3 Aug, 3:19PM</TextDefault>
          </View>
          <View>
            <Image source={require('../../assets/images/food_placeholder.png')} style={styles.image}/>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <StarRating numberOfStars={5} onSelect={onSelectRating}/>
        </View>

        {showSection && <View>
          <TextDefault textColor={theme.gray900} H4 bolder style={{ marginVertical: scale(8) }}>Tell others about your experience with Hardees Z-block</TextDefault>
          <OutlinedTextField
            label={'Review'}
            placeholder='Type here'
            fontSize={scale(12)}
            maxLength={250}
            textAlignVertical="top"
            baseColor={theme.verticalLine}
            multiline={true}
          />
        </View>}
      </View>
    </Modalize>
  )
}
const StarRating = ({ numberOfStars = 5, onSelect }) => {
  const stars = Array.from({ length: numberOfStars }, (_, index) => index + 1)
  const [selected, setSelected] = useState(0)
  const onPress = index => {
    onSelect(index)
    setSelected(index)
  }
  return (
    <View style={styles.starContainer}>
      {stars.map(index => <TouchableWithoutFeedback key={`star-${index}`} onPress={() => onPress(index + 1)}>
        <View style={{ flex: 1 }}>
          <StarIcon isFilled={index + 1 <= selected}/>
        </View>
      </TouchableWithoutFeedback>)}
    </View>
  )
}

export default forwardRef(Review)
