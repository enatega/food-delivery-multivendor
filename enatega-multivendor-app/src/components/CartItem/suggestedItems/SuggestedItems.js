import React from 'react';
import { FlatList, Text, View } from 'react-native';

const SuggestedItems = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default SuggestedItems;
