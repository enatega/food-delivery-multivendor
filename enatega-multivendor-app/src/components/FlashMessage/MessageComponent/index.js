import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import TextDefault from '../../Text/TextDefault/TextDefault'
const { height: HEIGHT } = Dimensions.get('window')
const MESSAGE_TOP = HEIGHT / 2
export const MessageComponent = props => (
  <View style={styles.flashMessage}>
    <TextDefault textColor={'#fff'} numberOfLines={3}>
      {props.message.message}
    </TextDefault>
  </View>
)

const styles = StyleSheet.create({
  flashMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: MESSAGE_TOP,
    borderRadius: 15,
    backgroundColor: 'rgba(52, 52, 52, .9)',
    marginHorizontal: 20,
    padding: 10
  }
})
