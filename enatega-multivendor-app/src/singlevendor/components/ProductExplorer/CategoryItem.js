// import React, { memo } from 'react';
// import { Text, Pressable, StyleSheet } from 'react-native';

// const CategoryItem = ({ title, active, onPress }) => (
//   <Pressable
//     onPress={onPress}
//     style={[styles.item, active && styles.activeItem]}
//   >
//     <Text style={[styles.text, active && styles.activeText]}>
//       {title}
//     </Text>
//   </Pressable>
// );

// export default memo(CategoryItem);

// const styles = StyleSheet.create({
//   item: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 18,
//     backgroundColor: '#EEE',
//     marginHorizontal: 6,
//   },
//   activeItem: { backgroundColor: '#CDEEFF' },
//   text: { fontSize: 13, color: '#555' },
//   activeText: { color: '#007AFF', fontWeight: '600' },
// });

import React, { memo, useContext } from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const CategoryItem = ({
  title,
  active,
  onPress,
  variant = 'pill'
}) => {
  const isUnderline = variant === 'underline'
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles(currentTheme).container,
        isUnderline ? styles(currentTheme).underlineContainer : styles(currentTheme).pillContainer,
        active && !isUnderline && styles(currentTheme).activePill
      ]}
    >
      <Text
        style={[
          styles(currentTheme).text,
          active && styles(currentTheme).activeText,
          isUnderline && styles(currentTheme).underlineText
        ]}
      >
        {title}
      </Text>

      {/* ✅ Full-width underline */}
      {isUnderline && (
        <View
          style={[
            styles(currentTheme).underline,
            active && styles(currentTheme).underlineActive
          ]}
        />
      )}
    </Pressable>
  )
}

export default memo(CategoryItem)

const styles = (currentTheme) => StyleSheet.create({
  /* Base */
  container: {
    alignItems: 'center',
    marginHorizontal: 8

  },

  text: {
    fontSize: 14,
    color: currentTheme.colorTextMuted
  },

  activeText: {
    color: currentTheme.singleVendorBrandForeground,
    fontWeight: '600'
  },

  /* Pill variant */
  pillContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: currentTheme.colorBgTertiary
  },

  activePill: {
    backgroundColor: currentTheme.singleVendorBrandSubtle
  },

  /* Underline variant */
  underlineContainer: {
    paddingVertical: 10

  },

  underlineText: {
    fontSize: 14,
    paddingHorizontal: 12
  },

  underline: {
    marginTop: 12,
    height: 2,
    width: '100%', // ✅ full width of item
    backgroundColor: 'transparent',
    borderRadius: 1
  },

  underlineActive: {
    backgroundColor: currentTheme.singleVendorBrand
  }
})
