import { View, StyleSheet } from 'react-native'
import React from 'react'
import SectionHeader from './SectionHeader'
import { alignment } from '../../utils/alignment'
import SectionErrorCard from './SectionErrorCard'

const SectionListError = ({
  title = 'Limited time deals',
  errorMessage = "Oops! We couldn't load the data. Tap 'Retry' to try again.",
  onRetry = null
}) => {
  return (
    <View style={styles.container}>
      <SectionHeader title={title} showSeeAll={false} />
      <SectionErrorCard message={errorMessage} onRetry={onRetry} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...alignment.MTlarge,
    ...alignment.MBsmall
  }
})

export default SectionListError
