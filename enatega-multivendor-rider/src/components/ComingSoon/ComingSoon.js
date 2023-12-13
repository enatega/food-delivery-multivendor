import React from 'react'
import { StyleSheet, View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import {useTranslation} from 'react-i18next'
const ComingSoon = () => {
  const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <TextDefault center bold H5>
        {t('walletFeature')}
      </TextDefault>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
export default ComingSoon
