import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { View, TouchableOpacity, TextInput } from 'react-native'
import CustomerMarker from '../../assets/SVG/customer-marker'
import { MapStyles } from '../../utils/mapStyle'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'

export const Map = ({ selectedLocation, onRegionChange, mapRef }) => {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation
      zoomEnabled={true}
      zoomControlEnabled={true}
      rotateEnabled={false}
      initialRegion={{
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      onRegionChangeComplete={onRegionChange}
      customMapStyle={MapStyles}
      provider={PROVIDER_GOOGLE}>
      <Marker coordinate={selectedLocation} title="Current Address">
        <CustomerMarker />
      </Marker>
    </MapView>
  )
}

export const ConfirmView = ({ theme, onConfirmLocation = () => {} }) => (
  <View
    style={[
      styles.confirmContainer,
      styles.shadow,
      { backgroundColor: theme.white }
    ]}>
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onConfirmLocation}
      style={[
        styles.shadow,
        styles.roundButton,
        {
          backgroundColor: theme.main
        }
      ]}>
      <TextDefault style={{ padding: 5 }} bolder H4>
        Confirm location
      </TextDefault>
    </TouchableOpacity>
  </View>
)

export const SearchBarWithAutocomplete = ({
  value,
  onChangeText,
  showPredictions
  //   setInputSize
}) => {
  const {
    searchBarAutoCompleteContainer,
    searchBarAutoCompleteInputStyle
  } = styles

  const inputBottomRadius = showPredictions
    ? {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
    : {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    }

  return (
    <View style={[searchBarAutoCompleteContainer]}>
      <TextInput
        style={[searchBarAutoCompleteInputStyle, inputBottomRadius]}
        placeholder="Search by address"
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        // onLayout={(event) => {
        //   const { height, width } = event.nativeEvent.layout
        // //   setInputSize({ height, width })
        // }}
      />
    </View>
  )
}
