import React, { useContext, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { IMAGE_LINK } from '../../utils/constants'
import CheckboxBtn from '../../ui/FdCheckbox/CheckboxBtn'
import { useTranslation } from 'react-i18next'

const ReorderItem = props => {
  const { t, i18n } = useTranslation()

  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const imageUrl =
    props?.itemImage && props?.itemImage.trim() !== ''
      ? props?.itemImage
      : IMAGE_LINK
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <TouchableOpacity style={styles(currentTheme).itemContainer} onPress={props.onPress} activeOpacity={0.7}>
      <View
        style={{
          flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
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
            H5
          isRTL>
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
                  style={{ flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                  <TextDefault
                    textColor={currentTheme.secondaryText}
                    Normal
                  isRTL>

                    {props?.optionsTitle?.slice(0, 3).length} {t('additionalItems')}

                  </TextDefault>
                  <Feather
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={currentTheme.iconColorDark}
                  />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={styles().itemsDropdown}>
                    {props?.optionsTitle?.slice(0, 3).map((item, index) => (
                      <TextDefault
                        key={index}
                        textColor={currentTheme.secondaryText}
                        Normal
                      isRTL>
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
              flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
              gap: scale(8),
              alignItems: 'center',
              marginTop: scale(4)
            }}>
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.fontFourthColor}
              bolder
              Normal
            isRTL>
              {configuration.currencySymbol}
              {parseFloat(props.dealPrice).toFixed(2)}
            </TextDefault>
          </View>
        </View>
      </View>
      <CheckboxBtn
        checked={props.checked}
        onPress={props.onPress}
      />
    </TouchableOpacity>
  )
}

export default ReorderItem
