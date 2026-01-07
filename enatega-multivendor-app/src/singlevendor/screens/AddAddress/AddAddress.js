import { View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import navigationOptions from './navigationOptions'
import useAddAddress from './useAddAddress'
import { useNavigation } from '@react-navigation/native'
import SearchingAddress from '../../components/AddAddress/SearchingAddress'
import SelectionOnMap from '../../components/AddAddress/SelectionOnMap'
import SearchedAddress from '../../components/AddAddress/SearchedAddress'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

const AddAddress = () => {
  const {
    t,
    currentTheme,
    themeContext,
    activeState,
    setactiveState,
    addressDetail,
    setAddressDetail,
    insets,
    confirmationButtonHandler,
    selectedType,
    setSelectedType,
    loading,
    // Search-related
    searchText,
    predictions,
    searchError,
    handleTextChange,
    handlePlaceSelect,
    handleClearSearch,
    isSearched,
    // Map-related
    mapRef,
    initialLocation,
    onRegionChangeComplete,
    setCurrentLocation,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    otherAddressDetails,
    setOtherAddressDetails
  } = useAddAddress()

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        title: 'Add new address',
        headerMenuBackground: currentTheme.themeBackground,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.iconColor,
        currentTheme: currentTheme,
        state: activeState,
        setState: setactiveState,
        navigation
      })
    )
  }, [navigation, currentTheme, activeState])

  return (
    <>
      {activeState === 'searching' ? (
        <SearchingAddress currentTheme={currentTheme} t={t} setactiveState={setactiveState} loading={loading} searchText={searchText} predictions={predictions} searchError={searchError} handleTextChange={handleTextChange} handlePlaceSelect={handlePlaceSelect} handleClearSearch={handleClearSearch} isSearched={isSearched} />
      ) : activeState === 'map' ? (
        <SelectionOnMap currentTheme={currentTheme} themeContext={themeContext} setState={setactiveState} addressDetail={addressDetail} loading={loading} mapRef={mapRef} initialLocation={initialLocation} onRegionChangeComplete={onRegionChangeComplete} setCurrentLocation={setCurrentLocation} DEFAULT_LATITUDE={DEFAULT_LATITUDE} DEFAULT_LONGITUDE={DEFAULT_LONGITUDE} LATITUDE_DELTA={LATITUDE_DELTA} LONGITUDE_DELTA={LONGITUDE_DELTA} />
      ) : (
        <SearchedAddress currentTheme={currentTheme} t={t} addressDetail={addressDetail} selectedType={selectedType} setSelectedType={setSelectedType} loading={loading} otherAddressDetails={otherAddressDetails} setOtherAddressDetails={setOtherAddressDetails} />
      )}
      <View style={{ alignItems: 'center', position: 'absolute', bottom: 0, paddingBottom: insets.bottom + 10 }}>
        {activeState !== 'searching' && (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, minWidth: '100%' }}>
            <ContinueWithPhoneButton title={activeState === 'map' ? 'Confirm' : 'Save address'} onPress={confirmationButtonHandler} containerStyles={{ minWidth: '90%' }} isLoading={loading} isDisabled={loading || !addressDetail} />
          </View>
        )}
      </View>
    </>
  )
}

export default AddAddress
