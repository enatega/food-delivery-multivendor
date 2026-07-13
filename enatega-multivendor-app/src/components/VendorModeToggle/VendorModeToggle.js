import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useVendorModeStore from '../../singlevendor/stores/useVendorModeStore';

const VendorModeToggle = () => {
//   const [mode, setMode] = useState('SINGLE');
const { vendorMode, setVendorMode } = useVendorModeStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          vendorMode === 'SINGLE' && styles.activeButton,
        ]}
        onPress={() => setVendorMode('SINGLE')}
      >
        <Text
          style={[
            styles.text,
            vendorMode === 'SINGLE' && styles.activeText,
          ]}
        >
          SINGLE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          vendorMode === 'MULTI' && styles.activeButton,
        ]}
        onPress={() => setVendorMode('MULTI')}
      >
        <Text
          style={[
            styles.text,
            vendorMode === 'MULTI' && styles.activeText,
          ]}
        >
          MULTI
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VendorModeToggle;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
    
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: '#2563EB',
  },
  text: {
    color: '#374151',
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
});