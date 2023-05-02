import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { View, TouchableOpacity, Keyboard } from 'react-native'
import { TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import i18n from '../../../i18n'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Analytics from '../../utils/analytics'
function Tip(props) {
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const tipRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'Tipping'
    })
  }, [navigation])
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_TIPS)
  }, [])
  function onTipping() {
    const tipAmount = tipRef.current.value()
    if (isNaN(tipAmount)) FlashMessage({ message: 'Invalid Amount' })
    else if (Number(tipAmount) <= 0) {
      FlashMessage({ message: 'Amount must be greater than 0' })
    } else navigation.navigate('Cart', { tipAmount: Number(tipAmount) })
  }

  const HeaderLine = props => {
    return (
      <View style={styles().headerlineContainer}>
        <View
          style={[styles(currentTheme).headerLine, { width: props.lineWidth }]}
        />
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={[
            alignment.PTsmall,
            alignment.PBsmall,
            { width: props.textWidth }
          ]}
          small
          bold
          center
          uppercase>
          {props.headerName}
        </TextDefault>
        <View
          style={[styles(currentTheme).headerLine, { width: props.lineWidth }]}
        />
      </View>
    )
  }
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <HeaderLine
          headerName="Tipping Amount"
          textWidth="50%"
          lineWidth="25%"
        />
        <TouchableOpacity
          activeOpacity={1}
          style={styles().flex}
          onPress={() => Keyboard.dismiss()}>
          <View style={styles().upperContainer}>
            <View style={{ width: '70%' }}>
              <TextField
                ref={tipRef}
                label="Enter tip amount"
                keyboardType="numeric"
                labelFontSize={scale(12)}
                fontSize={scale(12)}
                labelHeight={10}
                maxLength={15}
                textColor={currentTheme.fontMainColor}
                baseColor={currentTheme.fontSecondColor}
                errorColor={currentTheme.textErrorColor}
                tintColor={currentTheme.iconColorPink}
                labelOffset={{ y1: -5 }}
                labelTextStyle={{ fontSize: scale(12), paddingTop: scale(1) }}
              />
            </View>
            <TouchableOpacity
              onPress={onTipping}
              style={styles(currentTheme).buttonContainer}>
              <TextDefault
                textColor={currentTheme.buttonText}
                H5
                bold
                uppercase>
                {i18n.t('apply')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Tip
