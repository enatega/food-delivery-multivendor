import React, { memo } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';

const CategoryItem = ({ title, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.item, active && styles.activeItem]}
  >
    <Text style={[styles.text, active && styles.activeText]}>
      {title}
    </Text>
  </Pressable>
);

export default memo(CategoryItem);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#EEE',
    marginHorizontal: 6,
  },
  activeItem: { backgroundColor: '#CDEEFF' },
  text: { fontSize: 13, color: '#555' },
  activeText: { color: '#007AFF', fontWeight: '600' },
});
