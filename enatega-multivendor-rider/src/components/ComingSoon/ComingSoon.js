import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <TextDefault center bold H5>
        Wallet feature coming soon
      </TextDefault>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
export default ComingSoon
