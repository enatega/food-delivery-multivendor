import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../utils/themeColors'
import screenOptions from './screenOptions'
import { View, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import UserContext from '../../context/User'
import Analytics from '../../utils/analytics'
import { textStyles } from '../../utils/textStyles'

import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

function Reorder(props) {
  const analytics = Analytics()

  const { t } = useTranslation()
  const order = props.route.params.item
  const themeContext = useContext(ThemeContext)
  const { setCartRestaurant, addCartItem } = useContext(UserContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const inset = useSafeAreaInsets()
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle('dark-content')
  })
  const [selectedItems, setItems] = useState([])

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
            Previous Order
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
  }, [props.navigation])
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_REORDER)
    }
    Track()
  }, [])
  const onSelect = index => {
    if (selectedItems.includes(index)) {
      const filteredItems = selectedItems.filter(i => i !== index)
      setItems(filteredItems)
    } else {
      setItems([...selectedItems, index])
    }
  }

  const onAddToCart = async () => {
    await setCartRestaurant(order.restaurant._id)
    selectedItems.forEach(async index => {
      const item = order.items[index]
      const addons = item.addons.map(addon => ({
        _id: addon._id,
        options: addon.options.map(({ _id }) => ({
          _id
        }))
      }))
      await addCartItem(
        item.food,
        item.variation._id,
        item.quantity,
        addons,
        index === 0
      )
    })
    props.navigation.reset({
      routes: [{ name: 'Main' }, { name: 'Cart' }]
    })
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles(currentTheme).scrollViewStyle}>
        <View style={styles(currentTheme).mainContainer}>
          <TextDefault bolder H4 textColor={currentTheme.fontMainColor}>
            Select Items to order again
          </TextDefault>
          {order.items.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  ...alignment.MTmedium
                }}>
                <TouchableOpacity onPress={() => onSelect(index)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[alignment.MRmedium]}>
                      <CheckboxBtn
                        checked={selectedItems.includes(index)}
                        onPress={() => onSelect(index)}
                      />
                    </View>

                    <TextDefault
                      numberOfLines={1}
                      H5
                      textColor={currentTheme.fontMainColor}>
                      {item.title}
                    </TextDefault>
                  </View>
                </TouchableOpacity>

                <View style={{ width: '50%' }}>
                  {item.addons.map((addon, index) => {
                    return (
                      <View key={index}>
                        <TextDefault
                          style={alignment.MTxSmall}
                          textColor={currentTheme.fontSecondColor}
                          numberOfLines={1}>
                          + {addon.title}
                        </TextDefault>
                        {addon.options.map((option, index) => (
                          <TextDefault
                            key={index}
                            style={alignment.MLsmall}
                            textColor={currentTheme.fontSecondColor}
                            numberOfLines={1}>
                            - {option.title}
                          </TextDefault>
                        ))}
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
        <View style={styles(currentTheme).buttonContainer}>
          <TouchableOpacity
            disabled={selectedItems.length === 0}
            style={
              selectedItems.length > 0
                ? styles(currentTheme).buttonStyles
                : {
                    ...styles(currentTheme).buttonStyles,
                    backgroundColor: currentTheme.lightHorizontalLine
                  }
            }
            onPress={onAddToCart}>
            <TextDefault bolder textColor={currentTheme.black}>
              {t('addToCart')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Reorder
