import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import darkMapStyle from '../../../utils/DarkMapStyles'
import { mapStyle } from '../../../utils/mapStyle'
import Spinner from '../../../components/Spinner/Spinner'

const SelectionOnMap = ({ currentTheme, themeContext, setState, addressDetail, loading, mapRef, initialLocation, onRegionChangeComplete, setCurrentLocation, DEFAULT_LATITUDE, DEFAULT_LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA }) => {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={styles(currentTheme).buttonContainer}>
        <AntDesign
          onPress={() => {
            setState('searching')
          }}
          name='arrowleft'
          size={24}
          color={currentTheme?.iconColor}
          style={[styles(currentTheme).headerLeftIcon]}
        />
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, width: '100%', height: '100%' }}
        initialRegion={{
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
        customMapStyle={themeContext.ThemeValue === 'Dark' ? darkMapStyle : mapStyle}
        onRegionChangeComplete={onRegionChangeComplete}
        showsBuildings={true}
        showsIndoors={true}
        showsCompass={true}
        pitchEnabled={true}
        rotateEnabled={true}
        toolbarEnabled={true}
        moveOnMarkerPress={false}
        showsPointsOfInterest={true}
        zoomEnabled={true}
        scrollEnabled={true}
        zoomControlEnabled={false}
        zoomTapEnabled={true}
        maxZoomLevel={22}
        minZoomLevel={1}
        mapType='standard'
        onMapReady={() => console.log('map is ready')}
      />

      <View style={styles().mainContainer} pointerEvents='none'>
        {addressDetail && (
          <View style={[styles(currentTheme).calloutWrapper, styles(currentTheme).shadow]}>
            {loading ? (
              <Spinner size='small' spinnerColor={currentTheme.primaryBlue} />
            ) : (
              <TextDefault center bolder small numberOfLines={2}>
                {addressDetail}
              </TextDefault>
            )}
            <View style={styles(currentTheme).calloutArrow} />
          </View>
        )}
        <View style={[styles(currentTheme).markerContainer]}>
          <View style={[styles(currentTheme).marker, styles(currentTheme).shadow]} />
        </View>
      </View>

      <Pressable disabled={loading} onPress={setCurrentLocation} hitSlop={15} style={[styles(currentTheme).locationContainer, styles(currentTheme).shadow]}>
        <MaterialIcons name='my-location' size={20} color={loading ? currentTheme?.horizontalLine : currentTheme?.iconColor} />
      </Pressable>
    </View>
  )
}

export default SelectionOnMap

const styles = (currentTheme) =>
  StyleSheet.create({
    headerLeftIcon: {
      ...alignment.MLmedium,
      ...alignment.PxSmall,
      borderRadius: scale(50),
      backgroundColor: currentTheme?.radioOuterColor,
      borderWidth: 1,
      borderColor: currentTheme?.newBorderColor2 ?? '#efefef'
    },
    buttonContainer: {
      position: 'absolute',
      top: 0,
      paddingTop: 10,
      alignItems: 'center',
      zIndex: 10
    },
    mainContainer: {
      width: scale(50),
      height: scale(50),
      position: 'absolute',
      top: '46%',
      left: '50%',
      zIndex: 1,
      translateX: scale(-25),
      translateY: scale(-25),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: scale(-25) }, { translateY: scale(-25) }]
    },
    locationContainer: {
      width: scale(30),
      height: scale(30),
      backgroundColor: currentTheme?.radioOuterColor,
      position: 'absolute',
      bottom: '10%',
      right: '2%',
      zIndex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(50)
    },
    shadow: {
      elevation: 4,
      shadowColor: currentTheme?.shadowColor || '#000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.3,
      shadowRadius: 5
    },
    markerContainer: {
      backgroundColor: currentTheme?.lowOpacityBlue,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25
    },
    marker: {
      backgroundColor: currentTheme?.headerMainFontColor ?? '#006189',
      width: 20,
      height: 20,
      borderWidth: scale(3),
      borderRadius: scale(50),
      borderColor: currentTheme?.radioOuterColor ?? '#fff'
    },
    calloutWrapper: {
      zIndex: 1,
      minWidth: scale(150),
      position: 'absolute',
      bottom: scale(45),
      backgroundColor: currentTheme?.themeBackground ?? '#fff',
      paddingHorizontal: scale(14),
      paddingVertical: scale(8),
      borderRadius: scale(10),
      alignItems: 'center'
    },
    calloutArrow: {
      position: 'absolute',
      bottom: -8,
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: currentTheme?.themeBackground ?? '#fff'
    }
  })
