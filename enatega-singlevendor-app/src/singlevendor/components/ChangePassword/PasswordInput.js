import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  currentTheme
}) => {
  const [isSecure, setIsSecure] = useState(true)

  return (
    <View style={styles(currentTheme).container}>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).label}
        bolder
      >
        {label}
      </TextDefault>
      <View style={styles(currentTheme).inputContainer}>
        <TextInput
          style={styles(currentTheme).input}
          placeholder={placeholder}
          placeholderTextColor={currentTheme.fontSecondColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          style={styles(currentTheme).eyeButton}
        >
          <Ionicons
            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
            size={scale(20)}
            color={currentTheme.fontSecondColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      marginBottom: verticalScale(4)
    },
    label: {
      fontSize: scale(14),
      marginBottom: verticalScale(8)
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props?.cardBackground || '#FFFFFF',
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: props?.gray200 || '#E5E5E5',
      paddingHorizontal: scale(12)
    },
    input: {
      flex: 1,
      paddingVertical: verticalScale(14),
      fontSize: scale(15),
      color: props?.fontMainColor || '#000000'
    },
    eyeButton: {
      padding: scale(4)
    }
  })

export default PasswordInput
