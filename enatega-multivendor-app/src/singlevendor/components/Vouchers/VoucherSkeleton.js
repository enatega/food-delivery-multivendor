import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Svg, { Circle, Line, Path } from 'react-native-svg'
import { scale, verticalScale } from '../../../utils/scaling'

const VoucherSkeleton = ({ currentTheme }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [shimmerAnim])

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7]
  })

  return (
    <View style={styles(currentTheme).cardWrapper}>
      <View style={styles(currentTheme).card}>
        {/* Left side - Discount Badge Skeleton */}
        <View style={styles(currentTheme).discountBadge}>
          <Animated.View
            style={[
              styles(currentTheme).skeletonBox,
              styles(currentTheme).discountAmountSkeleton,
              { opacity }
            ]}
          />
          <Animated.View
            style={[
              styles(currentTheme).skeletonBox,
              styles(currentTheme).discountLabelSkeleton,
              { opacity }
            ]}
          />
        </View>

        {/* Middle - Voucher Details Skeleton */}
        <View style={styles(currentTheme).cardInfo}>
          <View>
            <Animated.View
              style={[
                styles(currentTheme).skeletonBox,
                styles(currentTheme).titleSkeleton,
                { opacity }
              ]}
            />
            <Animated.View
              style={[
                styles(currentTheme).skeletonBox,
                styles(currentTheme).descriptionSkeleton,
                { opacity }
              ]}
            />
          </View>
          <View style={styles(currentTheme).bottomRow}>
            <Animated.View
              style={[
                styles(currentTheme).skeletonBox,
                styles(currentTheme).buttonSkeleton,
                { opacity }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Dashed Line with SVG */}
      <View style={styles(currentTheme).dashedLineContainer}>
        <Svg height="100%" width={scale(2)} style={styles(currentTheme).dashedLineSvg}>
          <Line
            x1={scale(1)}
            y1="0"
            x2={scale(1)}
            y2="100%"
            stroke="#D1D5DB"
            strokeWidth="3"
            strokeDasharray="4,4"
          />
        </Svg>
      </View>

      {/* Top Notch */}
      <View style={styles(currentTheme).topNotch}>
        <Svg height={scale(16)} width={scale(16)} style={styles(currentTheme).notchSvg}>
          <Circle cx={scale(8)} cy={scale(8)} r={scale(8)} fill={currentTheme.themeBackground || '#F9FAFB'} />
          <Path
            d={`M 0 ${scale(8)} A ${scale(8)} ${scale(8)} 0 0 0 ${scale(16)} ${scale(8)}`}
            stroke="#E5E7EB"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </View>

      {/* Bottom Notch */}
      <View style={styles(currentTheme).bottomNotch}>
        <Svg height={scale(16)} width={scale(16)} style={styles(currentTheme).notchSvg}>
          <Circle cx={scale(8)} cy={scale(8)} r={scale(8)} fill={currentTheme.themeBackground || '#F9FAFB'} />
          <Path
            d={`M 0 ${scale(8)} A ${scale(8)} ${scale(8)} 0 0 1 ${scale(16)} ${scale(8)}`}
            stroke="#E5E7EB"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    cardWrapper: {
      marginBottom: verticalScale(16),
      position: 'relative'
    },
    card: {
      flexDirection: 'row',
      backgroundColor: props !== null ? props.white : '#FFFFFF',
      borderRadius: scale(16),
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      height: verticalScale(130),
      borderWidth: 1,
      borderColor: '#E5E7EB'
    },
    discountBadge: {
      width: scale(80),
      backgroundColor: '#CCE9F5',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(8)
    },
    cardInfo: {
      flex: 1,
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      justifyContent: 'space-between'
    },
    skeletonBox: {
      backgroundColor: '#E5E7EB',
      borderRadius: scale(6)
    },
    discountAmountSkeleton: {
      width: scale(50),
      height: scale(24),
      marginBottom: verticalScale(4)
    },
    discountLabelSkeleton: {
      width: scale(35),
      height: scale(18)
    },
    titleSkeleton: {
      width: '70%',
      height: scale(20),
      marginTop: verticalScale(8)
    },
    descriptionSkeleton: {
      width: '90%',
      height: scale(16),
      marginTop: verticalScale(8)
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: verticalScale(50)
    },
    buttonSkeleton: {
      width: scale(70),
      height: verticalScale(32),
      borderRadius: scale(8)
    },
    topNotch: {
      position: 'absolute',
      left: scale(80) - scale(8),
      top: -scale(8),
      zIndex: 10
    },
    bottomNotch: {
      position: 'absolute',
      left: scale(80) - scale(8),
      bottom: -scale(8),
      zIndex: 10
    },
    notchSvg: {
      overflow: 'visible'
    },
    dashedLineContainer: {
      position: 'absolute',
      left: scale(80) - scale(1),
      top: scale(8),
      bottom: scale(8),
      width: scale(2),
      zIndex: 5
    },
    dashedLineSvg: {
      position: 'absolute',
      left: 0,
      top: 0
    }
  })

export default VoucherSkeleton
