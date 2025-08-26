import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import TextDefault from '../../Text/TextDefault/TextDefault.js'
import { EvilIcons, Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons'
import { verticalScale } from '../../../utils/scaling.js'

const ButtonContainer = (props) => {
  const currentTheme = props.currentTheme
  const IconComponent =
  props.iconType === 'Ionicons' ? Ionicons :
  props.iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
  Ionicons;

  return (
   <>
    <View style={[styles(currentTheme).flexRow, styles().padding]}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles(currentTheme).linkContainer}
        onPress={props.onPress}
      >
        <View style={styles(currentTheme).mainLeftContainer}>
          <View style={styles(currentTheme).leftContainer}>
            <IconComponent
              name={props.icon}
              size={verticalScale(12)}
              color={currentTheme.darkBgFont}
            />
          </View>
          <TextDefault
            style={styles().drawerContainer}
            textColor={currentTheme.fontMainColor}
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
            color={currentTheme.darkBgFont}
          />
        {/* </View> */}
      </TouchableOpacity>

    </View>
      {/* <View style={styles().line} /> */}
   </>
  )
}

export default ButtonContainer
