import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import LoadingSkeleton from '../../LoadingSkeleton'
import { scale } from '../../../../utils/scaling'
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'

const OrderStatusSkeleton = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const themedStyles = styles(currentTheme)

  return (
    <View>
      {/* Delivery Time Banner Skeleton */}
      <View style={themedStyles.bannerContainer}>
        <LoadingSkeleton width='60%' height={16} />
        <View style={{ marginTop: scale(4) }}>
          <LoadingSkeleton width='40%' height={24} />
        </View>
      </View>

      {/* Order Status Timeline Skeleton */}
      <View style={themedStyles.container}>
        {/* Status item 1 */}
        <View style={themedStyles.statusItem}>
          <View style={themedStyles.leftSection}>
            <LoadingSkeleton width={scale(28)} height={scale(28)} borderRadius={scale(14)} />
            <View style={themedStyles.connector} />
          </View>
          <View style={themedStyles.contentSection}>
            <LoadingSkeleton width='70%' height={18} />
          </View>
          <View style={themedStyles.rightSection}>
            <LoadingSkeleton width='30%' height={14} />
          </View>
        </View>

        {/* Status item 2 */}
        <View style={themedStyles.statusItem}>
          <View style={themedStyles.leftSection}>
            <LoadingSkeleton width={scale(28)} height={scale(28)} borderRadius={scale(14)} />
          </View>
          <View style={themedStyles.contentSection}>
            <LoadingSkeleton width='60%' height={18} />
          </View>
          <View style={themedStyles.rightSection}>
            <LoadingSkeleton width='25%' height={14} />
          </View>
        </View>
      </View>

      {/* Delivery Details Card Skeleton */}
      <View style={themedStyles.deliveryContainer}>
        <LoadingSkeleton width='40%' height={20} style={{ marginBottom: scale(16) }} />
        <View style={themedStyles.addressRow}>
          <View style={themedStyles.addressLeft}>
            <LoadingSkeleton width={scale(22)} height={scale(22)} borderRadius={scale(11)} />
            <View style={themedStyles.addressContent}>
              <LoadingSkeleton width='30%' height={16} />
              <LoadingSkeleton width='80%' height={14} />
            </View>
          </View>
          <LoadingSkeleton width={scale(20)} height={scale(20)} />
        </View>
      </View>

      {/* Contact Courier Card Skeleton */}
      <View style={themedStyles.contactContainer}>
        <LoadingSkeleton width='50%' height={20} />
        <LoadingSkeleton width='70%' height={14} style={{ marginTop: scale(8) }} />
      </View>

      {/* Order Items Section Skeleton */}
      <View style={themedStyles.itemsContainer}>
        <LoadingSkeleton width='35%' height={20} style={{ marginBottom: scale(12) }} />

        <View style={themedStyles.collapsedRow}>
          <View style={themedStyles.imageStack}>
            <LoadingSkeleton width={scale(36)} height={scale(36)} borderRadius={scale(18)} />
            <LoadingSkeleton width={scale(36)} height={scale(36)} borderRadius={scale(18)} style={{ marginLeft: -scale(12) }} />
          </View>
          <View style={themedStyles.summaryContent}>
            <LoadingSkeleton width='80%' height={16} />
          </View>
          <LoadingSkeleton width={scale(20)} height={scale(20)} />
        </View>
      </View>
    </View>
  )
}

export default OrderStatusSkeleton

const styles = currentTheme => StyleSheet.create({
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
    backgroundColor:
      currentTheme.newBorderColor2 ||
      currentTheme.colorBorder ||
      currentTheme.horizontalLine,
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
    backgroundColor: currentTheme.cardBackground,
    padding: scale(16),
    alignItems: 'center',
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:
      currentTheme.newBorderColor2 ||
      currentTheme.colorBorder ||
      currentTheme.horizontalLine,
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
    backgroundColor: currentTheme.cardBackground,
    borderRadius: scale(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:
      currentTheme.newBorderColor2 ||
      currentTheme.colorBorder ||
      currentTheme.horizontalLine,
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
