import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoadingSkeleton from '../../LoadingSkeleton'
import { scale } from '../../../../utils/scaling'

const OrderStatusSkeleton = () => {
  return (
    <View>
      {/* Delivery Time Banner Skeleton */}
      <View style={styles.bannerContainer}>
        <LoadingSkeleton width='60%' height={16} />
        <View style={{ marginTop: scale(4) }}>
          <LoadingSkeleton width='40%' height={24} />
        </View>
      </View>

      {/* Order Status Timeline Skeleton */}
      <View style={styles.container}>
        {/* Status item 1 */}
        <View style={styles.statusItem}>
          <View style={styles.leftSection}>
            <LoadingSkeleton width={scale(28)} height={scale(28)} borderRadius={scale(14)} />
            <View style={styles.connector} />
          </View>
          <View style={styles.contentSection}>
            <LoadingSkeleton width='70%' height={18} />
          </View>
          <View style={styles.rightSection}>
            <LoadingSkeleton width='30%' height={14} />
          </View>
        </View>

        {/* Status item 2 */}
        <View style={styles.statusItem}>
          <View style={styles.leftSection}>
            <LoadingSkeleton width={scale(28)} height={scale(28)} borderRadius={scale(14)} />
          </View>
          <View style={styles.contentSection}>
            <LoadingSkeleton width='60%' height={18} />
          </View>
          <View style={styles.rightSection}>
            <LoadingSkeleton width='25%' height={14} />
          </View>
        </View>
      </View>

      {/* Delivery Details Card Skeleton */}
      <View style={styles.deliveryContainer}>
        <LoadingSkeleton width='40%' height={20} style={{ marginBottom: scale(16) }} />
        <View style={styles.addressRow}>
          <View style={styles.addressLeft}>
            <LoadingSkeleton width={scale(22)} height={scale(22)} borderRadius={scale(11)} />
            <View style={styles.addressContent}>
              <LoadingSkeleton width='30%' height={16} />
              <LoadingSkeleton width='80%' height={14} />
            </View>
          </View>
          <LoadingSkeleton width={scale(20)} height={scale(20)} />
        </View>
      </View>

      {/* Contact Courier Card Skeleton */}
      <View style={styles.contactContainer}>
        <LoadingSkeleton width='50%' height={20} />
        <LoadingSkeleton width='70%' height={14} style={{ marginTop: scale(8) }} />
      </View>

      {/* Order Items Section Skeleton */}
      <View style={styles.itemsContainer}>
        <LoadingSkeleton width='35%' height={20} style={{ marginBottom: scale(12) }} />

        <View style={styles.collapsedRow}>
          <View style={styles.imageStack}>
            <LoadingSkeleton width={scale(36)} height={scale(36)} borderRadius={scale(18)} />
            <LoadingSkeleton width={scale(36)} height={scale(36)} borderRadius={scale(18)} style={{ marginLeft: -scale(12) }} />
          </View>
          <View style={styles.summaryContent}>
            <LoadingSkeleton width='80%' height={16} />
          </View>
          <LoadingSkeleton width={scale(20)} height={scale(20)} />
        </View>
      </View>
    </View>
  )
}

export default OrderStatusSkeleton

const styles = StyleSheet.create({
  container: {
    padding: scale(16)
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: scale(48)
  },
  leftSection: {
    alignItems: 'center',
    width: scale(32)
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: scale(20),
    backgroundColor: '#E5E7EB',
    marginVertical: scale(4)
  },
  contentSection: {
    flex: 1,
    paddingLeft: scale(12),
    paddingTop: scale(4)
  },
  rightSection: {
    paddingTop: scale(4)
  },
  bannerContainer: {
    backgroundColor: '#F3F4F6',
    padding: scale(16),
    alignItems: 'center',
    borderRadius: scale(12),
    marginHorizontal: scale(16),
    marginTop: scale(8)
  },
  deliveryContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16)
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  addressContent: {
    marginLeft: scale(12),
    flex: 1,
    gap: scale(6)
  },
  contactContainer: {
    padding: scale(16),
    backgroundColor: '#F3F4F6',
    borderRadius: scale(12),
    marginHorizontal: scale(16),
    marginTop: scale(16)
  },
  itemsContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16)
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageStack: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryContent: {
    flex: 1,
    marginLeft: scale(12),
    justifyContent: 'center',
    alignItems: 'center'
  }
})
