import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import Svg, { Circle, Line, Path } from 'react-native-svg'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
// import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const VoucherCard = ({ voucher, currentTheme, onUse }) => {
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).cardWrapper}>
      <View style={styles(currentTheme).card}>
        {/* Left side - Discount Badge */}
        <View style={styles(currentTheme).discountBadge}>
          <TextDefault
            textColor="#006189"
            style={styles(currentTheme).discountAmount}
            bolder
            center
          >
            {voucher.discountAmount}
          </TextDefault>
          <TextDefault
            textColor="#006189"
            style={styles(currentTheme).discountLabel}
            bolder
            center
          >
            {voucher.discountLabel}
          </TextDefault>
        </View>

        {/* Middle - Voucher Details */}
        <View style={styles(currentTheme).cardInfo}>
          <View>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).voucherTitle}
              bolder
            >
              {voucher.title}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.colorTextMuted}
              style={styles(currentTheme).voucherDescription}
              bold
            >
              {voucher.description}
            </TextDefault>
          </View>
          <View style={styles(currentTheme).bottomRow}>
            {voucher.badge && (
              <View style={styles(currentTheme).badgeContainer}>
                <TextDefault
                  textColor="#A16207"
                  style={styles(currentTheme).voucherBadge}
                  bold
                >
                  {voucher.badge}
                </TextDefault>
              </View>
            )}
            <TouchableOpacity
              style={styles(currentTheme).useButton}
              onPress={onUse}
              activeOpacity={0.7}
            >
              <TextDefault
                textColor="#FFFFFF"
                style={styles(currentTheme).useButtonText}
                bolder
              >
                {t('Use')}
              </TextDefault>
            </TouchableOpacity>
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
      width: scale(90),
      backgroundColor: '#CCE9F5',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(8)
    },
    discountAmount: {
      fontSize: scale(20),
      lineHeight: scale(24)
    },
    discountLabel: {
      fontSize: scale(16),
      lineHeight: scale(18),
      marginTop: verticalScale(4)
    },
    cardInfo: {
      flex: 1,
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(16),
      justifyContent: 'space-between'
    },
    voucherTitle: {
      fontSize: scale(16),
      lineHeight: scale(20),
      marginTop: verticalScale(8)
    },
    voucherDescription: {
      fontSize: scale(13),
      lineHeight: scale(18),
      // marginBottom: verticalScale(4),
      marginTop: verticalScale(4),
      color: '#6B7280'
    },
    voucherBadge: {
      fontSize: scale(12),
      lineHeight: scale(16),
      alignSelf: 'flex-start',
    },
    badgeContainer: {
      backgroundColor: '#FEFCE8',
      borderRadius: scale(6),
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(6)
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: verticalScale(50),
      position: 'relative'
    },
    useButton: {
      backgroundColor: '#0090CD',
      borderRadius: scale(8),
      paddingHorizontal: scale(18),
      paddingVertical: verticalScale(6),
      minWidth: '51px',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      bottom: 0
    },
    useButtonText: {
      fontSize: scale(14),
      lineHeight: scale(18)
    },
    topNotch: {
      position: 'absolute',
      left: scale(90) - scale(8),
      top: -scale(8),
      zIndex: 10
    },
    bottomNotch: {
      position: 'absolute',
      left: scale(90) - scale(8),
      bottom: -scale(8),
      zIndex: 10
    },
    notchSvg: {
      overflow: 'visible'
    },
    dashedLineContainer: {
      position: 'absolute',
      left: scale(90) - scale(1),
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

export default VoucherCard
