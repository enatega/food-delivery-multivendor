import React, { useState, useContext } from 'react'
import {
  Ionicons,
  EvilIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign
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
import { alignment } from '../../../utils/alignment'
import CartIcon from '../../../assets/SVG/imageComponents/CartIcon'

const rippleColor = '#6FCF97'
function BackButton(props) {
  if (props.icon === 'leftArrow') {
    return (
      <Ionicons
        name="ios-arrow-back"
        size={16}
        style={styles().leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'menu') {
    return (
      <Ionicons
        name="ios-menu"
        size={16}
        style={styles().leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'dots') {
    return (
      <MaterialCommunityIcons
        name="dots-vertical"
        size={16}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'target') {
    return (
      <MaterialIcons name="my-location" size={16} color={props.iconColor} />
    )
  } else if (props.icon === 'fav') {
    return <AntDesign name="hearto" size={16} color={props.iconColor} />
  } else {
    return (
      <EvilIcons
        name="close"
        size={16}
        style={styles().leftIconPadding}
        color={props.iconColor}
      />
    )
  }
}

function LeftButton(props) {
  const navigation = useNavigation()
  if (props.icon === 'back') {
    return (
      <HeaderBackButton
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'leftArrow' })
        }
        onPress={() => {
          navigationService.goBack()
        }}
      />
    )
  } else if (props.icon === 'close') {
    return (
      <HeaderBackButton
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'close' })
        }
        onPress={() => {
          navigation.dispatch(state => {
            const routes = state.routes.filter(r => r.name === 'Main')
            return CommonActions.reset({
              ...state,
              routes,
              index: 0
            })
          })
        }}
      />
    )
  } else if (props.toggle) {
    return (
      <HeaderBackButton
        labelVisible={false}
        backImage={() =>
          BackButton({
            iconColor: props.iconColor,
            icon: props.toggleValue ? 'leftArrow' : 'close'
          })
        }
        onPress={() =>
          props.toggleValue
            ? navigation.goBack()
            : props.toggleView(prev => !prev)
        }
      />
    )
  } else {
    return (
      <HeaderBackButton
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() =>
          BackButton({ iconColor: props.iconColor, icon: 'menu' })
        }
        onPress={() => navigation.toggleDrawer()}
      />
    )
  }
}

function RightButton(props) {
  const [password, setPassword] = useState(false)
  const navigation = useNavigation()
  const route = useRoute()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { cartCount, isLoggedIn, profile } = useContext(UserContext)
  function showPasswordButton() {
    props.titlePosition(prev => !prev)
    setPassword(prev => !prev)
  }
  function clickPasswordButton() {
    props.titlePosition(prev => !prev)
    setPassword(prev => !prev)
    props.modalVisible(prev => !prev)
  }

  function cartIcon() {
    return (
      <View style={[styles().rightContainer, { ...alignment.PRsmall }]}>
        <CartIcon width={16} height={16} />
        <View
          style={
            styles(
              route.name === 'Main'
                ? currentTheme.iconColorPink
                : currentTheme.white
            ).absoluteContainer
          }>
          <TextDefault
            textColor={
              route.name === 'Main'
                ? currentTheme.fontWhite
                : currentTheme.black
            }
            style={{ fontSize: scale(7) }}
            center
            bold>
            {cartCount}
          </TextDefault>
        </View>
      </View>
    )
  }

  function navigateCart() {
    if (cartCount > 0) {
      navigation.navigate('Cart')
    } else {
      FlashMessage({
        message: 'Cart is empty.'
      })
    }
  }
  if (props.icon === 'dots') {
    return (
      <View>
        {password ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles().rightContainer, styles().passwordContainer]}
            onPress={clickPasswordButton}>
            <View style={styles(currentTheme.cartContainer).titlePasswordText}>
              <TextDefault
                style={{ fontSize: scale(11) }}
                textColor={currentTheme.fontMainColor}
                bold>
                Change password
              </TextDefault>
            </View>
          </TouchableOpacity>
        ) : (
          <HeaderBackButton
            labelVisible={false}
            backImage={() => (
              <View style={styles().rightContainer}>
                {BackButton({ iconColor: props.textColor, icon: 'dots' })}
              </View>
            )}
            onPress={showPasswordButton}
          />
        )}
      </View>
    )
  } else if (props.icon === 'cart') {
    return (
      <View
        style={[cartCount < 1 && alignment.PRxSmall, { flexDirection: 'row' }]}>
        <HeaderBackButton
          pressColorAndroid={route.name === 'Main' && rippleColor}
          labelVisible={false}
          backImage={() => (
            <View style={styles().favContainer}>
              {BackButton({ iconColor: props.iconColor, icon: 'fav' })}
            </View>
          )}
          onPress={() =>
            isLoggedIn && profile
              ? navigation.navigate('Favourite')
              : navigation.navigate('CreateAccount')
          }
        />
        {cartCount > 0 && (
          <HeaderBackButton
            pressColorAndroid={route.name === 'Main' && rippleColor}
            labelVisible={false}
            backImage={cartIcon}
            onPress={navigateCart}
          />
        )}
      </View>
    )
  } else if (props.icon === 'target') {
    return (
      <HeaderBackButton
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() => (
          <View style={[styles().rightContainer, { ...alignment.PRsmall }]}>
            {BackButton({ iconColor: props.iconColor, icon: 'target' })}
          </View>
        )}
        onPress={props.onPressRight}
      />
    )
  } else {
    return null
  }
}
function DarkBackButton(props) {
  return (
    <View
      style={{
        backgroundColor: props.iconBackground,
        margin: 5,
        borderRadius: 5
      }}>
      <Ionicons
        name="chevron-back-outline"
        size={20}
        style={styles().darkBackArrow}
        color={props.iconColor}
      />
    </View>
  )
}
export { BackButton, LeftButton, RightButton, DarkBackButton }
