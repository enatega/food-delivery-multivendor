// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useContext, useState } from 'react'
// import styles from './styles'
// import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
// import { useTranslation } from 'react-i18next'
// import { theme } from '../../../utils/themeColors'
// import TextDefault from '../../../components/Text/TextDefault/TextDefault'
// const CartItemDescription = ({ variations }) => {
//   console.log('Variations in CartItemDescription::', variations)
//   const { t, i18n } = useTranslation()

//   const themeContext = useContext(ThemeContext)
//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   }
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen)
//   }

//   return (
//     <>
//       <TouchableOpacity onPress={toggleDropdown} activeOpacity={0.7} style={styles().descriptionRow}>
//         <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} small isRTL style={styles().descriptionText}>
//           {variations?.map((variation) => variation?.variationTitle).join(', ')}
//         </TextDefault>
//         {addons && addons.length > 0 && <Feather name={isDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={currentTheme.fontMainColor} />}
//       </TouchableOpacity>

//       {/* Expanded Addons */}
//       {isDropdownOpen && item?.addons && item.addons.length > 0 && (
//         <View style={styles().itemsDropdown}>
//           {item.addons.map((addon, index) => (
//             <TextDefault key={index} textColor={currentTheme.fontSecondColor} small isRTL>
//               • {addon}
//             </TextDefault>
//           ))}
//         </View>
//       )}
//     </>
//   )
// }

// export default CartItemDescription


import { View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import Feather from 'react-native-vector-icons/Feather'

const CartItemDescription = ({ variations }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  // ✅ Collect ALL addons from ALL variations
  const allAddons = variations?.flatMap(
    variation => variation?.addons || []
  ) || []

  return (
    <View>
      {/* Variation Titles Row */}
      <TouchableOpacity
        onPress={toggleDropdown}
        activeOpacity={0.7}
        style={styles().descriptionRow}
      >
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          small
          isRTL
          style={styles().descriptionText}
        >
          {variations?.map(v => v?.variationTitle).join(', ')}
        </TextDefault>

        {allAddons.length > 0 && (
          <Feather
            name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={currentTheme.fontMainColor}
          />
        )}
      </TouchableOpacity>

      {/* Dropdown Addons List */}
      {isDropdownOpen && allAddons.length > 0 && (
        <View style={styles().addonContainer}>
          {allAddons.map((addon, index) => (
            <View key={index} style={styles().addonRow}>
              <TextDefault
                small
                textColor={currentTheme.fontMainColor}
              >
                • {addon?.title || addon?.addonTitle}
              </TextDefault>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default CartItemDescription
