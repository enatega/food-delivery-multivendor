import React, { useContext, useState } from 'react'
import { Alert, Image, TouchableOpacity, View } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'

const cartItem = props => {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownItems = ['Item 1', 'Item 2', 'Item 3']
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  return (
    <View style={styles().itemContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: scale(7)
        }}>
        <View style={styles().suggestItemImgContainer}>
          <Image
            source={require('../../assets/images/burger-menu.png')}
            style={styles().suggestItemImg}
            resizeMode="contain"
          />
        </View>
        <View>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H5>
            {props.dealName.length > 20
              ? props.dealName.substring(0, 17) + '...'
              : props.dealName}
          </TextDefault>

          {props.optionsTitle.map((option, index) => (
            <TextDefault
              key={`options${props.dealName + option + index}`}
              numberOfLines={1}
              textColor={currentTheme.fontSecondColor}
              bolder>
              +{option}
            </TextDefault>
          ))}
          <View style={styles().additionalItem}>
            <View>
              <TouchableOpacity
                onPress={toggleDropdown}
                activeOpacity={1}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextDefault
                  style={{ marginRight: scale(5) }}
                  textColor={currentTheme.secondaryText}
                  Normal>
                  {dropdownItems.length} Additional Items
                </TextDefault>
                <Feather
                  name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={currentTheme.iconColorDark}
                />
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={styles().itemsDropdown}>
                  {dropdownItems.map((item, index) => (
                    <TextDefault
                      key={index}
                      textColor={currentTheme.secondaryText}
                      Normal>
                      {item}
                    </TextDefault>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: scale(8),
              alignItems: 'center'
            }}>
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontFourthColor}
              bolder
              Normal>
              {configuration.currencySymbol}
              {parseFloat(props.dealPrice).toFixed(2)}
            </TextDefault>
            <View style={styles().divider} />
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Alert', 'Under development')
              }}>
              <TextDefault
                textColor={currentTheme.fontFourthColor}
                bolder
                Normal>
                Edit
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles(currentTheme).actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).minusBtn
          ]}
          onPress={props.removeQuantity}>
          <AntDesign
            name={props.quantity < 2 ? 'delete' : 'minus'}
            size={scale(18)}
            color={currentTheme.fontFourthColor}
          />
        </TouchableOpacity>

        <View style={styles(currentTheme).actionContainerView}>
          <TextDefault H5 bold textColor={currentTheme.black}>
            {props.quantity}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).plusBtn
          ]}
          onPress={props.addQuantity}>
          <AntDesign name="plus" size={scale(18)} color={currentTheme.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default cartItem
