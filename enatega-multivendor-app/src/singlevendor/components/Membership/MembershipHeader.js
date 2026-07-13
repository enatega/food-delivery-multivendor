import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import styles from '../../screens/Membership/styles'

const MembershipHeader = ({ currentTheme, onBack }) => {
  return (
    <View style={styles(currentTheme).header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles(currentTheme).backButton}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).backButtonCircle}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={currentTheme.fontMainColor}
          />
        </View>
      </TouchableOpacity>
      <View style={styles(currentTheme).headerRight} />
    </View>
  )
}

export default MembershipHeader
