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


import React, { memo } from 'react'
import { Text, Pressable, StyleSheet, View } from 'react-native'

const CategoryItem = ({
  title,
  active,
  onPress,
  variant = 'pill',
}) => {
  const isUnderline = variant === 'underline'

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isUnderline ? styles.underlineContainer : styles.pillContainer,
        active && !isUnderline && styles.activePill,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.activeText,
          isUnderline && styles.underlineText,
        ]}
      >
        {title}
      </Text>

      {/* ✅ Full-width underline */}
      {isUnderline && (
        <View
          style={[
            styles.underline,
            active && styles.underlineActive,
          ]}
        />
      )}
    </Pressable>
  )
}

export default memo(CategoryItem)

const styles = StyleSheet.create({
  /* Base */
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
 
  },

  text: {
    fontSize: 14,
    color: '#555',
  },

  activeText: {
    color: '#007AFF',
    fontWeight: '600',
  },

  /* Pill variant */
  pillContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#EEE',
  },

  activePill: {
    backgroundColor: '#CDEEFF',
  },

  /* Underline variant */
  underlineContainer: {
    paddingVertical: 10,
    
  },

  underlineText: {
    fontSize: 14,
    paddingHorizontal:12
  },

  underline: {
    marginTop: 12,
    height: 2,
    width: '100%', // ✅ full width of item
    backgroundColor: 'transparent',
    borderRadius: 1,
  },

  underlineActive: {
    backgroundColor: '#007AFF',
  },
})