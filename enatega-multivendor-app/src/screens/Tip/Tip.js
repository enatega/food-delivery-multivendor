import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { View, TouchableOpacity, Keyboard, StatusBar, Platform } from 'react-native'
import { TextField, OutlinedTextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import styles from './styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { textStyles } from '../../utils/textStyles'

function Tip(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const inset = useSafeAreaInsets()
  const tipRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useFocusEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <TextDefault
            style={{
              color: currentTheme.btnText,
              ...textStyles.H4,
              ...textStyles.Bolder
            }}>
            Tipping
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.btnText,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        backgroundColor: currentTheme.transparent
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={{ ...alignment.PLxSmall }}>
              <AntDesign
                name="arrowleft"
                size={22}
                color={currentTheme.fontFourthColor}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  })
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
    } else navigation.navigate('Checkout', { tipAmount: Number(tipAmount) })
  }

  const HeaderLine = props => {}
  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <HeaderLine textWidth="100%" lineWidth="25%" />
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
                fontSize: scale(12)
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles(currentTheme).buttonContainer}>
            <TouchableOpacity onPress={onTipping}>
              <TextDefault
                textColor={currentTheme.buttonText}
                H5
                bold
                uppercase>
                {t('apply')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default Tip
