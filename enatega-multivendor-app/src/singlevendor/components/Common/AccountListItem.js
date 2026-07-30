import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const AccountListItem = ({ 
  currentTheme, 
  label, 
  value, 
  verified = false, 
  onPress = null 
}) => {
  const ItemContent = () => (
    <View style={styles(currentTheme).listItemContent}>
      <View style={styles(currentTheme).listItemLeft}>
        <TextDefault
          H5
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).label}
          bolder
        >
          {label}
        </TextDefault>
        <View style={styles(currentTheme).valueContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={styles(currentTheme).value}
          >
            {value}
          </TextDefault>
          {verified && (
            <View style={styles(currentTheme).verifiedBadge}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#047857"
              />
            </View>
          )}
        </View>
      </View>
      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={currentTheme.fontMainColor}
        />
      )}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles(currentTheme).listItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <ItemContent />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles(currentTheme).listItem}>
      <ItemContent />
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    listItem: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16)
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    listItemLeft: {
      flex: 1,
      marginRight: scale(12)
    },
    label: {
      marginBottom: verticalScale(4)
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8)
    },
    value: {
      fontSize: scale(14)
    },
    verifiedBadge: {
      marginLeft: scale(4)
    }
  })

export default AccountListItem
