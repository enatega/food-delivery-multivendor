import React, { useState, useContext } from 'react'
import {
  Ionicons,
  EvilIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  SimpleLineIcons
} from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { TouchableOpacity, View } from 'react-native'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import {
  useNavigation,
  CommonActions,
  useRoute
} from '@react-navigation/native'
import navigationService from '../../../routes/navigationService'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { HeaderBackButton } from '@react-navigation/elements'
import UserContext from '../../../context/User'

const rippleColor = '#6FCF97'
function BackButton(props) {
  const navigation = useNavigation()
  if (props?.icon === 'leftArrow') {
    return (
      <Ionicons
        name='arrow-back'
        size={20}
        style={styles().leftIconPadding}
        color={props?.iconColor}
        onPress={() => {
          if (props?.prevScreen) {
            navigation.navigate(props?.prevScreen)
          } else {
            console.warn('No prevScreen prop provided')
          }
        }}
      />
    )
  } else if (props?.icon === 'menu') {
    return (
      <SimpleLineIcons
        name='menu'
        size={20}
        color={props?.iconColorDark}
        style={styles().leftIconPadding}
      />
    )
  } else if (props?.icon === 'dots') {
    return (
      <MaterialCommunityIcons
        name='dots-vertical'
        size={25}
        color={props?.iconColor}
      />
    )
  } else if (props?.icon === 'target') {
    return (
      <MaterialIcons name='my-location' size={16} color={props?.iconColor} />
    )
  } else if (props?.icon === 'fav') {
    return <AntDesign name='hearto' size={20} color={props?.iconColorDark} />
  } else {
    return (
      <EvilIcons
        name='close'
        size={16}
        style={styles().leftIconPadding}
        color={props?.newIconColor}
      />
    )
  }
}

function LeftButton(props) {
  const navigation = useNavigation()
  if (props?.icon === 'back') {
    return (
      <HeaderBackButton
        truncatedLabel=''
        backImage={() =>
          BackButton({ iconColor: props?.newIconColor, icon: 'leftArrow' })
        }
        onPress={() => {
          navigationService.goBack()
        }}
      />
    )
  } else if (props?.icon === 'close') {
    return (
      <HeaderBackButton
        truncatedLabel=''
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props?.newIconColor, icon: 'close' })
        }
        onPress={() => {
          navigation.dispatch((state) => {
            const routes = state.routes.filter((r) => r.name === 'Main')
            return CommonActions.reset({
              ...state,
              routes,
              index: 0
            })
          })
        }}
      />
    )
  } else if (props?.toggle) {
    return (
      <HeaderBackButton
        truncatedLabel=''
        labelVisible={false}
        backImage={() =>
          BackButton({
            iconColor: props?.newIconColor,
            icon: props?.toggleValue ? 'leftArrow' : 'close'
          })
        }
        onPress={() =>
          props?.toggleValue
            ? navigation.goBack()
            : props?.toggleView((prev) => !prev)
        }
      />
    )
  } else {
    return (
      <HeaderBackButton
        truncatedLabel=''
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props?.newIconColor, icon: 'menu' })
        }
        onPress={() => navigation.toggleDrawer()}
      />
    )
  }
}

function RightButton(props) {
  const { t } = props
  const [password, setPassword] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { cartCount, isLoggedIn, profile } = useContext(UserContext)
  function showPasswordButton() {
    props?.titlePosition((prev) => !prev)
    setPassword((prev) => !prev)
  }
  function clickPasswordButton() {
    props?.titlePosition((prev) => !prev)
    setPassword((prev) => !prev)
    props?.modalVisible((prev) => !prev)
  }

  function cartIcon() {
    return (
      <View style={styles().rightContainer}>
        <MaterialCommunityIcons name="cart-outline" size={28} color={currentTheme.iconColor} />
        {
          cartCount > 0 && (
            <View
              style={
                styles(route.name === 'Main' ? 'black' : currentTheme.white)
                  .absoluteContainer
              }
            >
              <TextDefault
                textColor={currentTheme.white}
                style={{ fontSize: scale(10) }}
                center
                bolder
              >
                {cartCount}
              </TextDefault>
            </View>
          )
        }
      </View>
    )
  }

  function navigateCart() {
    if (cartCount > 0) {
      navigation.navigate('Cart')
    } else {
      FlashMessage({
        message: t('cartIsEmpty')
      })
    }
  }
  if (props?.icon === 'dots') {
    return (
      <View>
        {password ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles().rightContainer, styles().passwordContainer]}
            onPress={clickPasswordButton}
          >
            <View style={styles(currentTheme.cartContainer).titlePasswordText}>
              <TextDefault
                style={{ fontSize: scale(11) }}
                textColor={currentTheme.fontMainColor}
                bold
              >
                {t('changePassword')}
              </TextDefault>
            </View>
          </TouchableOpacity>
        ) : (
          <HeaderBackButton
            truncatedLabel=''
            labelVisible={false}
            backImage={() => (
              <View style={styles().rightContainer}>
                {BackButton({ iconColor: props?.textColor, icon: 'dots' })}
              </View>
            )}
            onPress={showPasswordButton}
          />
        )}
      </View>
    )
  } else if (props?.icon === 'cart') {
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* <HeaderBackButton
          truncatedLabel=''
          pressColorAndroid={route.name === 'Main' && rippleColor}
          labelVisible={false}
          backImage={() => (
            <View style={styles().favContainer}>
              {BackButton({ iconColor: currentTheme.darkBgFont, icon: 'fav' })}
            </View>
          )}
          bolder
          onPress={() =>
            isLoggedIn && profile
              ? navigation.navigate('Favourite')
              : navigation.navigate('CreateAccount')
          }
        /> */}
        {cartCount >= 0 && (
          <HeaderBackButton
            truncatedLabel=''
            pressColorAndroid={route.name === 'Main' && rippleColor}
            labelVisible={false}
            backImage={cartIcon}
            onPress={navigateCart}
          />
        )}
      </View>
    )
  } else if (props?.icon === 'target') {
    return (
      <HeaderBackButton
        truncatedLabel=''
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() => (
          <View style={[styles().rightContainer]}>
            {BackButton({ iconColor: props?.iconColor, icon: 'target' })}
          </View>
        )}
        onPress={props?.onPressRight}
      />
    )
  } else {
    return null
  }
}
function DarkBackButton(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View
      style={{
        backgroundColor: props?.themeBackground,
        borderRadius: 5,
    
      }}
    >
      <Ionicons
        name='close-circle-outline'
        size={20}
        style={styles().darkBackArrow}
        color={currentTheme.newIconColor}
      />
    </View>
  )
}
function HelpButton(props) {
  const { t } = props
  return (
    <TouchableOpacity
      style={{
        backgroundColor: props?.iconBackground,
        borderRadius: scale(10),
        margin: scale(5)
      }}
      onPress={() => props?.navigation.navigate('Help')}
    >
      <TextDefault style={styles().rightButtonContainer} center small bold>
        {t('help')}
      </TextDefault>
    </TouchableOpacity>
  )
}
export { BackButton, LeftButton, RightButton, DarkBackButton, HelpButton }
