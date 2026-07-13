import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale } from '../../../utils/scaling'
import LoadingSkeleton from '../../components/LoadingSkeleton'

const OrderSummarySkeleton = () => {
  return (
    <View>
      {/* Total */}
      <View style={styles.summaryRow}>
        <LoadingSkeleton width='30%' height={18} />
        <LoadingSkeleton width='25%' height={18} />
      </View>

      {/* Notes */}
      <View style={{ marginTop: scale(8), width: '60%' }}>
        <LoadingSkeleton height={12} />
      </View>
    </View>
  )
}

export default OrderSummarySkeleton


const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12)
  }
})
