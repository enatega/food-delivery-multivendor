import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const CustomMarkerWithLabel = ({ coordinate, label, icon, onPress, currentTheme }) => {
  const styles = getStyles(currentTheme);

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles.markerContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Marker>
  );
};

const getStyles = (currentTheme) => StyleSheet.create({
  markerContainer: {
    // alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  label: {
    marginTop: 2,
    color: currentTheme.black,
    fontWeight: 'bold',
  },
});

export default CustomMarkerWithLabel;
