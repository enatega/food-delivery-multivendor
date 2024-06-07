import React, { useContext, useState } from 'react'
import { Alert, Image, TouchableOpacity, View } from 'react-native'
import { AntDesign, Feather, EvilIcons} from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { IMAGE_LINK } from '../../utils/constants'

const CartItem = props => {
  const cartRestaurant = props.cartRestaurant
  const { t } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const imageUrl =
    props?.itemImage && props?.itemImage.trim() !== ''
      ? props.itemImage
      : IMAGE_LINK
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  const navigation = useNavigation()

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
            source={{ uri: imageUrl }}
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
            {props?.dealName?.length > 20
              ? props.dealName.substring(0, 17) + '...'
              : props.dealName}
          </TextDefault>

          {props?.itemAddons?.length > 0 && (
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
                    {props?.optionsTitle?.slice(0, 3)?.length}{' '}
                    {t('additionalItems')}
                  </TextDefault>
                  <Feather
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={currentTheme.iconColorDark}
                  />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={styles().itemsDropdown}>
                    {props?.optionsTitle?.slice(0, 3)?.map((item, index) => (
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
          )}

          <View
            style={{
              flexDirection: 'row',
              gap: scale(8),
              alignItems: 'center',
              marginTop: scale(4)
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
            <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { _id: cartRestaurant })}>
              <TextDefault
                textColor={currentTheme.fontFourthColor}
                bolder
                Normal>
                {t('edit')}
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
          {props.quantity < 2 ? (
            <EvilIcons 
              name="trash"
              size={scale(25)}
              color={currentTheme.color4}
            />
          ) : (
            <AntDesign
              name="minus"
              size={scale(18)}
              color={currentTheme.color4}
            />
          )}
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

export default CartItem
