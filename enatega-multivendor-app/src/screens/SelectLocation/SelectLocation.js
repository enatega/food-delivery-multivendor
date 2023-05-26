import React, { useEffect } from 'react'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import styles from './styles'
import {
  ConfirmView,
  Map,
  SearchBarWithAutocomplete
} from './SelectLocation.components'
import useSelectLocation from './useSelectLocation'
import BackArrowBlackBg from '../../assets/SVG/back-arrow-black-bg'

const SelectLocation = ({ navigation }) => {
  const {
    theme,
    selectedLocation,
    onRegionChange,
    onConfirmLocation,
    search,
    setSearch,
    showPredictions,
    predictions,
    onPredictionTapped,
    mapRef
  } = useSelectLocation({ navigation })

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  const _renderPredictions = predictions => {
    const { predictionsContainer, predictionRow } = styles

    return (
      <View style={styles.predictionsView}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={predictions}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={predictionRow}
                onPress={() =>
                  onPredictionTapped(item.place_id, item.description)
                }>
                <Text numberOfLines={1}>{item.description}</Text>
              </TouchableOpacity>
            )
          }}
          keyExtractor={item => item.place_id}
          contentContainerStyle={[styles.shadow, predictionsContainer]}
        />
      </View>
    )
  }
  return (
    <>
      <View style={{ flex: 1 }}>
        <Map
          mapRef={mapRef}
          selectedLocation={selectedLocation}
          onRegionChange={onRegionChange}
        />
        <ConfirmView theme={theme} onConfirmLocation={onConfirmLocation} />
      </View>
      <View style={[styles.header, { backgroundColor: theme.black }]}>
        <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
          <BackArrowBlackBg />
        </TouchableOpacity>
        <View style={[styles.inputContainer, { backgroundColor: theme.white }]}>
          <SearchBarWithAutocomplete
            value={search.term}
            onChangeText={text => {
              setSearch({ term: text, fetchPredictions: true })
            }}
            showPredictions={showPredictions}
            predictions={predictions}
            onPredictionTapped={onPredictionTapped}
          />
        </View>
      </View>
      {showPredictions && _renderPredictions(predictions)}
    </>
  )
}
export default SelectLocation
