// OptionList.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const OptionList = ({
  title,
  subtitle,
  list = [],
  isVariation = false,
  selectedIds = [],
  onChange,
}) => {
  const onPressItem = (id) => {
    if (isVariation) {
      // Radio selection
      onChange([id]);
    } else {
      // Checkbox selection
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter(x => x !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    }
  };

  const renderItem = ({ item }) => {
    const selected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => onPressItem(item.id)}
        activeOpacity={0.7}
      >
        {/* Radio / Checkbox */}
        <View style={[styles.selector, selected && styles.selected]}>
          {isVariation && selected && <View style={styles.innerDot} />}
          {!isVariation && selected && <Text style={styles.check}>✓</Text>}
        </View>

        {/* Title */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          {item.isPopular && <Text style={styles.badge}>Popular</Text>}
        </View>

        {/* Price */}
        {item.price !== undefined && (
          <Text style={styles.price}>${item.price}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

export default OptionList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    paddingHorizontal: 15
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#777',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selector: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selected: {
    borderColor: '#007AFF',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  check: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
  },
  badge: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  price: {
    fontWeight: '600',
  },
});
