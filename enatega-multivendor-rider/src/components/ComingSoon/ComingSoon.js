import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import i18n from '../../../i18n'

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <TextDefault center bold H5>
        {i18n.t('walletFeature')}
      </TextDefault>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
export default ComingSoon
