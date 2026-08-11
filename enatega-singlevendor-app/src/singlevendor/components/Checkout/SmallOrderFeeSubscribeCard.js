import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const SmallOrderFeeSubscribeCard = ({
  currentTheme,
  t,
  expanded,
  onToggle,
  onSubscribe
}) => {
  return (
    <View style={styles(currentTheme).container}>
      <TouchableOpacity
        style={styles(currentTheme).header}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles(currentTheme).headerContent}>
          <View style={styles(currentTheme).badge}>
            <TextDefault textColor={currentTheme.white} bolder small>
              {t('Plus') || 'PLUS'}
            </TextDefault>
          </View>
          <View style={styles(currentTheme).headerText}>
            <TextDefault textColor={currentTheme.fontMainColor} H6 bolder>
              {t('Save on delivery fees') || 'Save on delivery fees'}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
              small
            >
              {t('Subscribe to get free delivery') || 'Subscribe to get free delivery'}
            </TextDefault>
          </View>
        </View>
        <AntDesign
          name={expanded ? 'up' : 'down'}
          size={14}
          color={currentTheme.fontMainColor}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles(currentTheme).body}>
          <TextDefault
            textColor={currentTheme.colorTextMuted || currentTheme.fontSecondColor}
            style={styles(currentTheme).bodyText}
          >
            {t('No small order fees and extra savings with Membership.') ||
              'No small order fees and extra savings with Membership.'}
          </TextDefault>
          <TouchableOpacity
            style={styles(currentTheme).subscribeButton}
            onPress={onSubscribe}
            activeOpacity={0.8}
          >
            <TextDefault textColor={currentTheme.white} bolder>
              {t('Subscribe') || 'Subscribe'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      backgroundColor: props?.cardBackground || '#fff',
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: props?.newBorderColor2 || '#E4E4E7',
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(12),
      marginTop: scale(10),
      marginBottom: scale(8),
      shadowColor: props?.shadowColor || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    badge: {
      backgroundColor: props?.primaryBlue || props?.primary || '#0EA5E9',
      borderRadius: scale(6),
      paddingHorizontal: scale(6),
      paddingVertical: verticalScale(3),
      marginRight: scale(10)
    },
    headerText: {
      flex: 1,
      gap: scale(2)
    },
    body: {
      marginTop: verticalScale(10),
      borderTopWidth: 1,
      borderTopColor: props?.newBorderColor2 || '#E4E4E7',
      paddingTop: verticalScale(10)
    },
    bodyText: {
      fontSize: scale(12),
      lineHeight: scale(18),
      marginBottom: verticalScale(10)
    },
    subscribeButton: {
      backgroundColor: props?.singlevendorcolor || props?.primary || '#0EA5E9',
      paddingVertical: verticalScale(8),
      borderRadius: scale(8),
      alignSelf: 'flex-start',
      paddingHorizontal: scale(12)
    }
  })

export default SmallOrderFeeSubscribeCard
