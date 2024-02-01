import React, { useState, useContext } from 'react'
import {
  Ionicons,
  EvilIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Feather
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
import { useTranslation } from 'react-i18next'

const rippleColor = '#6FCF97'
function BackButton(props) {
  if (props.icon === 'leftArrow') {
    return (
      <Ionicons
        name="arrow-back"
        size={16}
        style={styles().leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'menu') {
    return (
      <Ionicons
        name="menu"
        size={30}
        style={styles().leftIconPadding}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'dots') {
    return (
      <MaterialCommunityIcons
        name="dots-vertical"
        size={25}
        color={props.iconColor}
      />
    )
  } else if (props.icon === 'target') {
    return (
      <MaterialIcons name="my-location" size={16} color={props.iconColor} />
    )
  } else if (props.icon === 'fav') {
    return <AntDesign name="hearto" size={20} color={props.iconColor} />
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
        truncatedLabel=""
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
        truncatedLabel=""
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
        truncatedLabel=""
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
        truncatedLabel=""
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
  const { t } = useTranslation()
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
      <View style={[styles().rightContainer, { ...alignment.PLsmall }]}>
        <Feather
          name="shopping-bag"
          size={25}
          color={currentTheme.darkBgFont}
        />
        <View
          style={
            styles(route.name === 'Main' ? 'black' : currentTheme.white)
              .absoluteContainer
          }>
          <TextDefault
            textColor={
              route.name === 'Main'
                ? currentTheme.fontWhite
                : currentTheme.black
            }
            style={{ fontSize: scale(12) }}
            center
            bolder>
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
        message: t('cartIsEmpty')
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
                {t('changePassword')}
              </TextDefault>
            </View>
          </TouchableOpacity>
        ) : (
          <HeaderBackButton
            truncatedLabel=""
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
      <View style={{ flexDirection: 'row' }}>
        <HeaderBackButton
          truncatedLabel=""
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
        />
        {cartCount >= 0 && (
          <HeaderBackButton
            truncatedLabel=""
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
        truncatedLabel=""
        pressColorAndroid={rippleColor}
        labelVisible={false}
        backImage={() => (
          <View style={[styles().rightContainer]}>
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
