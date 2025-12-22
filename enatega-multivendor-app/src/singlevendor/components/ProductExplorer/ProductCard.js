import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ProductCard = ({ item }) => {
  return (
    <Pressable style={styles.card}>
      <View style={styles.image} />
      <Text style={styles.price}>€ {item.price.toFixed(2)}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.size}>{item.size}</Text>
    </Pressable>
  );
};

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    margin: 8,
  },
  image: {
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    marginBottom: 8,
  },
  price: { fontWeight: '700', fontSize: 14 },
  title: { fontSize: 13 },
  size: { color: '#777', fontSize: 12 },
});
