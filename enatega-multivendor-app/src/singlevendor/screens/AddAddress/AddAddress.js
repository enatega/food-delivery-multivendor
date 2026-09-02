import { Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import useAddAddress from './useAddAddress'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import SearchingAddress from '../../components/AddAddress/SearchingAddress'
import SelectionOnMap from '../../components/AddAddress/SelectionOnMap'
import SearchedAddress from '../../components/AddAddress/SearchedAddress'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useLocationPermission from '../../../utils/useLocationPermission'

const AddAddress = () => {
  const {
    t,
    currentTheme,
    themeContext,
    activeState,
    setactiveState,
    addressDetail,
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
    setOtherAddressDetails,
    doorBell,
    setDoorBell
  } = useAddAddress()

  const navigation = useNavigation()
  const { requestPermission } = useLocationPermission()

  useEffect(() => {
    const initPermission = async() => {
      await requestPermission()
    }
    initPermission()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const handleHeaderBack = () => {
    if (activeState === 'searched') {
      setactiveState('searching')
      return
    }
    navigation.goBack()
  }

  return (
    <View style={[styles.screen, { backgroundColor: currentTheme.themeBackground }]}>
      {activeState !== 'map' && (
        <View
          style={[
            styles.safeHeader,
            {
              paddingTop: insets.top,
              backgroundColor: currentTheme.themeBackground,
              borderBottomColor: currentTheme.newBorderColor2
            }
          ]}
        >
          <View style={styles.headerBar}>
            <Pressable
              accessibilityRole='button'
              accessibilityLabel={activeState === 'searched' ? t('previous') : 'Close'}
              hitSlop={8}
              onPress={handleHeaderBack}
              style={({ pressed }) => [
                styles.headerButton,
                {
                  backgroundColor: currentTheme.colorBgTertiary,
                  opacity: pressed ? 0.65 : 1
                }
              ]}
            >
              <Feather
                name={activeState === 'searched' ? 'arrow-left' : 'x'}
                size={21}
                color={currentTheme.colorTextPrimary || currentTheme.fontMainColor}
              />
            </Pressable>
            <TextDefault H4 bolder textColor={currentTheme.colorTextPrimary || currentTheme.fontMainColor}>
              {t('addAddress')}
            </TextDefault>
            <View style={styles.headerSpacer} />
          </View>
        </View>
      )}

      {activeState === 'searching'
        ? (
        <SearchingAddress currentTheme={currentTheme} t={t} setactiveState={setactiveState} loading={loading} searchText={searchText} predictions={predictions} searchError={searchError} handleTextChange={handleTextChange} handlePlaceSelect={handlePlaceSelect} handleClearSearch={handleClearSearch} isSearched={isSearched} bottomInset={insets.bottom} />
          )
        : activeState === 'map'
          ? (
        <SelectionOnMap currentTheme={currentTheme} themeContext={themeContext} setState={setactiveState} addressDetail={addressDetail} loading={loading} mapRef={mapRef} initialLocation={initialLocation} onRegionChangeComplete={onRegionChangeComplete} setCurrentLocation={setCurrentLocation} DEFAULT_LATITUDE={DEFAULT_LATITUDE} DEFAULT_LONGITUDE={DEFAULT_LONGITUDE} LATITUDE_DELTA={LATITUDE_DELTA} LONGITUDE_DELTA={LONGITUDE_DELTA} insets={insets} />
            )
          : (
        <SearchedAddress currentTheme={currentTheme} t={t} addressDetail={addressDetail} selectedType={selectedType} setSelectedType={setSelectedType} loading={loading} otherAddressDetails={otherAddressDetails} setOtherAddressDetails={setOtherAddressDetails} doorBell={doorBell} setDoorBell={setDoorBell} setactiveState={setactiveState} bottomInset={insets.bottom} />
            )}
      {activeState !== 'searching' && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 10) + 10,
              backgroundColor: activeState === 'searched'
                ? currentTheme.themeBackground
                : 'transparent',
              borderTopColor: activeState === 'searched'
                ? currentTheme.newBorderColor2
                : 'transparent'
            }
          ]}
        >
          <ContinueWithPhoneButton
            title={activeState === 'map' ? 'Confirm' : 'Save address'}
            onPress={confirmationButtonHandler}
            containerStyles={styles.saveButton}
            isLoading={loading}
            isDisabled={loading || !addressDetail || (activeState === 'searched' && !selectedType)}
          />
        </View>
      )}
    </View>
  )
}

export default AddAddress

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  safeHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerBar: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerSpacer: {
    width: 38,
    height: 38
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 16
  }
})
