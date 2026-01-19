import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
// import { alignment } from '../../../utils/alignment'
import { alignment } from '../../utils/alignment'
// import { scale, verticalScale } from '../../../utils/scaling'
import { scale, verticalScale } from '../../utils/scaling'

const EmptyAccountSectionArea = ({
  currentTheme,
  imageSource,
  title,
  description,
  buttonTitle,
  onButtonPress
}) => {
  return (
    <View style={styles(currentTheme).container}>
      <View style={styles(currentTheme).illustrationContainer}>
        <Image
          source={imageSource}
          style={styles(currentTheme).illustration}
          resizeMode="contain"
        />
      </View>

      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).title}
        bolder
        center
      >
        {title}
      </TextDefault>

      <TextDefault
        textColor={currentTheme.colorTextMuted}
        style={styles(currentTheme).description}
        center
        bold
      >
        {description}
      </TextDefault>

      {onButtonPress && (
        <TouchableOpacity
          style={styles(currentTheme).button}
          onPress={onButtonPress}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={currentTheme.headerMainFontColor}
            style={styles(currentTheme).buttonText}
            bolder
          >
            {buttonTitle}
          </TextDefault>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: verticalScale(80),
      ...alignment.PTxLarge
    },
    illustrationContainer: {
      width: scale(250),
      height: scale(200),
      ...alignment.MBlarge
    },
    illustration: {
      width: '100%',
      height: '100%'
    },
    title: {
      fontSize: scale(20),
      ...alignment.MBsmall
    },
    description: {
      fontSize: scale(14),
      lineHeight: scale(20),
      ...alignment.PHlarge,
      paddingHorizontal: 12
    },
    button: {
      backgroundColor: props?.colorBgSecondary,
      paddingHorizontal: scale(32),
      paddingVertical: verticalScale(14),
      borderRadius: scale(8),
      marginTop: verticalScale(32),
      minWidth: scale(300),
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonText: {
      fontSize: scale(16),
      fontWeight: '600'
    }
  })

export default EmptyAccountSectionArea

