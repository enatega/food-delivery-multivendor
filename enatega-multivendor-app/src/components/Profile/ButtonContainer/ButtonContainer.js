import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import TextDefault from '../../Text/TextDefault/TextDefault.js'
import { EvilIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { verticalScale } from '../../../utils/scaling.js'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme.js'

const ButtonContainer = (props) => {
  const currentTheme = props.currentTheme
  const { tokens } = useMultivendorTheme()
  const visualTheme = { ...currentTheme, ...tokens }
  const IconComponent =
  props.iconType === 'Ionicons'
    ? Ionicons
    : props.iconType === 'MaterialCommunityIcons'
      ? MaterialCommunityIcons
      : Ionicons

  return (
   <>
    <View style={styles(visualTheme).flexRow}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles(visualTheme).linkContainer}
        onPress={props.onPress}
      >
        <View style={styles(visualTheme).mainLeftContainer}>
          <View style={styles(visualTheme).leftContainer}>
            <IconComponent
              name={props.icon}
              size={verticalScale(18)}
              color={tokens.colors.textSecondary}
            />
          </View>
          <TextDefault
            style={styles().drawerContainer}
            textColor={tokens.colors.textPrimary}
            small
            H4
            bold
          >
            {props.title}
          </TextDefault>
        </View>

        {/* <View style={styles(currentTheme).leftContainer}> */}
          <EvilIcons
            name={currentTheme.isRTL ? 'chevron-left' : 'chevron-right'}
            size={verticalScale(20)}
            color={tokens.colors.textMuted}
          />
        {/* </View> */}
      </TouchableOpacity>

    </View>
      {/* <View style={styles().line} /> */}
   </>
  )
}

export default ButtonContainer
