import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { View, TouchableOpacity, Keyboard } from 'react-native'
import { TextField, OutlinedTextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { Entypo } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

function Tip(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const tipRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: t('titleTipping'),
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: currentTheme.white,
        backgroundColor: currentTheme.black,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={styles().bacKButton}>
              <Entypo name="cross" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_TIPS)
    }
    Track()
  }, [])
  function onTipping() {
    const tipAmount = tipRef.current.value()
    if (isNaN(tipAmount)) FlashMessage({ message: t('invalidAmount') })
    else if (Number(tipAmount) <= 0) {
      FlashMessage({ message: t('amountMustBe') })
    } else navigation.navigate('Cart', { tipAmount: Number(tipAmount) })
  }

  const HeaderLine = props => {}
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <HeaderLine textWidth="45%" lineWidth="25%" />
        <View style={styles(currentTheme).upperContainer}>
          <View style={styles(currentTheme).innerContainer}>
            <OutlinedTextField
              ref={tipRef}
              label={t('otherAmount')}
              placeholder={t('addOtherAmount')}
              placeholderTextColor={currentTheme.secondaryText}
              labelFontSize={scale(12)}
              fontSize={scale(12)}
              textAlignVertical="top"
              multiline={false}
              maxLength={30}
              textColor={currentTheme.darkBgFont}
              baseColor={currentTheme.darkBgFont}
              errorColor={currentTheme.textErrorColor}
              tintColor={currentTheme.iconColorPink}
              labelOffset={{ y1: -5 }}
              labelTextStyle={{
                fontSize: scale(12),
                paddingTop: scale(1)
              }}
            />
          </View>
          <TouchableOpacity
            onPress={onTipping}
            style={styles(currentTheme).buttonContainer}>
            <TextDefault textColor={currentTheme.buttonText} H5 bold uppercase>
              {t('apply')}
            </TextDefault>
          </TouchableOpacity>
        </View>
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
