import React, { useContext, useState, useEffect } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../utils/themeColors'
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
import {  AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useRestaurant } from '../../ui/hooks'
import ReorderItem from '../../components/ReorderItem/ReorderItem'

function Reorder(props) {
  const analytics = Analytics()

  const { t } = useTranslation()
  const order = props.route.params.item
  const themeContext = useContext(ThemeContext)
  const { setCartRestaurant, addCartItem } = useContext(UserContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { data } = useRestaurant(order.restaurant._id)

  const inset = useSafeAreaInsets()
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  const [selectedItems, setItems] = useState([])

  useFocusEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <TextDefault
            style={{
              color: currentTheme.newFontcolor,
              ...textStyles.H4,
              ...textStyles.Bolder
            }}
          >
            {t('previousOrder')}
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLxSmall }}>
              <AntDesign
                name='arrowleft'
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
      await analytics.track(analytics.events.NAVIGATE_TO_REORDER)
    }
    Track()
  }, [])
  const onSelect = (index) => {
    if (selectedItems.includes(index)) {
      const filteredItems = selectedItems.filter((i) => i !== index)
      setItems(filteredItems)
    } else {
      setItems([...selectedItems, index])
    }
  }

  const onAddToCart = async () => {
    await setCartRestaurant(order.restaurant._id)
    selectedItems.forEach(async (index) => {
      const item = order.items[index]
      const addons = item.addons.map((addon) => ({
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

  const restaurant = data?.restaurant
  const addons = restaurant?.addons
  const options = restaurant?.options
  const foods = restaurant?.categories?.map(c => c.foods.flat()).flat()

  function populateFood(cartItem) {
    const food = foods?.find(food => food._id === cartItem.food)
    if (!food) return null
    const variation = food.variations.find(
      variation => variation._id === cartItem.variation._id
    )
    if (!variation) return null

    const title = `${food.title}${variation.title ? `(${variation.title})` : ''
      }`
    let price = variation.price
    const optionsTitle = []
    if (cartItem.addons) {
      cartItem.addons.forEach(addon => {
        const cartAddon = addons.find(add => add._id === addon._id)
        if (!cartAddon) return null
        addon.options.forEach(option => {
          const cartOption = options.find(opt => opt._id === option._id)
          if (!cartOption) return null
          price += cartOption.price
          optionsTitle.push(cartOption.title)
        })
      })
    }
    const populateAddons = addons.filter((addon) =>
      food?.variations[0]?.addons?.includes(addon._id)
    )
    return {
      ...cartItem,
      optionsTitle,
      title: title,
      price: price.toFixed(2),
      image: food.image,
      addons: populateAddons
    }
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles(currentTheme).scrollViewStyle}
      >
        <View style={styles(currentTheme).mainContainer}>
          <TextDefault bolder H4 textColor={currentTheme.fontMainColor}>
            {t('ItemsOrderAgain')}
          </TextDefault>
          {order.items.map((item, index) => {
            const food = populateFood(item)
            if(!food){
              return null
            }
            return (
              <ReorderItem
              key={food?._id}
                quantity={food?.quantity}
                dealName={food?.title}
                optionsTitle={food?.optionsTitle}
                itemImage={food?.image}
                itemAddons={food?.addons}
                dealPrice={(
                  parseFloat(food?.price) * food?.quantity
                ).toFixed(2)}
                checked={selectedItems.includes(index)}
                        onPress={() => onSelect(index)}
              
              />
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
            onPress={onAddToCart}
          >
            <TextDefault bolder textColor={selectedItems.length > 0 ? currentTheme.black : currentTheme.newFontcolor}>
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
