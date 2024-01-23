import React, { useLayoutEffect, useContext, useState, useEffect } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../utils/themeColors'
import screenOptions from './screenOptions'
import { View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import UserContext from '../../context/User'
import Analytics from '../../utils/analytics'

import { scale } from '../../utils/scaling'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
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
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  const [selectedItems, setItems] = useState([])

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: t('previous'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={styles().backButton}>
              <Entypo name="cross" size={30} color="black" />
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
          <TextDefault
            style={[alignment.MLmedium, alignment.MTmedium]}
            bolder
            H4
            textColor={currentTheme.fontMainColor}>
            {t('selectItems')}
          </TextDefault>
          {order.items.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  ...alignment.MLmedium,
                  ...alignment.MRmedium,
                  ...alignment.MTmedium
                }}>
                <View style={[alignment.MRmedium]}>
                  <CheckboxBtn
                    checked={selectedItems.includes(index)}
                    onPress={() => onSelect(index)}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <TextDefault
                    numberOfLines={1}
                    textColor={currentTheme.fontMainColor}>
                    {item.title}
                  </TextDefault>
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
