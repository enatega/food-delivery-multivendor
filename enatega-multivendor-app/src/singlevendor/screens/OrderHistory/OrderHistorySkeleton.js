import React from 'react'
import { View, StyleSheet } from 'react-native'

import LoadingSkeleton from '../../components/LoadingSkeleton'
import { scale, verticalScale } from '../../../utils/scaling'

const OrderHistorySkeleton = ({ currentTheme }) => {
  const themedStyles = styles(currentTheme)

  const items = Array.from({ length: 6 })

  return (
    <View style={themedStyles.container}>
      {items.map((_, index) => (
        <View key={index} style={themedStyles.itemContainer}>
          <View style={themedStyles.row}>
            <LoadingSkeleton
              width={scale(60)}
              height={scale(60)}
              borderRadius={scale(8)}
              style={themedStyles.imageSkeleton}
            />
            <View style={themedStyles.content}>
              <LoadingSkeleton
                width="70%"
                height={verticalScale(14)}
                borderRadius={scale(4)}
                style={themedStyles.nameSkeleton}
              />
              <LoadingSkeleton
                width="45%"
                height={verticalScale(12)}
                borderRadius={scale(4)}
                style={themedStyles.dateSkeleton}
              />
              <LoadingSkeleton
                width={scale(90)}
                height={verticalScale(18)}
                borderRadius={scale(9)}
                style={themedStyles.badgeSkeleton}
              />
            </View>
            <View style={themedStyles.priceContainer}>
              <LoadingSkeleton
                width={scale(70)}
                height={verticalScale(16)}
                borderRadius={scale(4)}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default OrderHistorySkeleton

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingTop: verticalScale(8),
      paddingBottom: verticalScale(24),
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    itemContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    imageSkeleton: {
      marginRight: scale(12)
    },
    content: {
      flex: 1,
      marginRight: scale(8)
    },
    nameSkeleton: {
      marginBottom: verticalScale(6)
    },
    dateSkeleton: {
      marginBottom: verticalScale(10)
    },
    badgeSkeleton: {
      marginTop: verticalScale(2)
    },
    priceContainer: {
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      minHeight: scale(60)
    }
  })


