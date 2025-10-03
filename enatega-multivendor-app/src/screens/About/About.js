import React, { useContext, useEffect, useState } from 'react'
import { View, StatusBar, Linking, TouchableOpacity, Platform } from 'react-native'
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
import { scale } from '../../utils/scaling'
import ImageHeader from '../../components/About/Header'
import styles from './styles'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'
import { aboutMapStyle } from '../../utils/aboutMapStyle'
import CustomMarker from '../../assets/SVG/restaurant-marker'
import analytics from '../../utils/analytics'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import ConfigurationContext from '../../context/Configuration'
import FavoriteButton from '../../components/FavButton/FavouriteButton'
import { mapStyle } from '../../utils/mapStyle'
import { customMapStyle } from '../../utils/customMapStyles'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

function About(props) {
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const { restaurantObject } = props.route.params
  const IsOpen = restaurantObject?.IsOpen
  const themeContext = useContext(ThemeContext)
  const { isConnected: connect } = useNetworkStatus()
  const configuration = useContext(ConfigurationContext)

  console.log(JSON.stringify(restaurantObject, null, 2), "restaurantObject")

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const RestAbout = {
    name: restaurantObject.name,
    id: restaurantObject._id,
    address: restaurantObject.address,
    deliveryTime: restaurantObject.deliveryTime,
    minimumOrder: restaurantObject.minimumOrder,
    rating: restaurantObject.rating,
    average: restaurantObject.average,
    isOpen: restaurantObject.IsOpen,
    phone: restaurantObject.phone,
    restaurantUrl: restaurantObject.restaurantUrl,
    tax : restaurantObject.tax,
    map: {
      latitude: Number(restaurantObject.latitude) || 0,
      longitude: Number(restaurantObject.longitude) || 0,
      latitudeDelta: 0.5,
      longitudeDelta: 0.4
    }
  }
  const currentDayShort = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase()
  const todayOpeningTimes = restaurantObject.openingTimes.find((opening) => opening.day === currentDayShort)

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ABOUT)
    }
    Track()
  }, [])

  const typeName = restaurantObject.__typename;
  console.log(RestAbout)

  if (!connect) return <ErrorView refetchFunctions={[]} />
  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={[
          // { marginTop: inset.top },
          styles().flex,
          { backgroundColor: currentTheme.headerMenuBackground }
        ]}
      >
        <ImageHeader iconColor={currentTheme.newIconColor} svgNameL='leftArrow' restaurantImage={restaurantObject.restaurantImage} restaurantName={ restaurantObject.restaurantName} deliveryTime={restaurantObject.deliveryTime} total={restaurantObject.total} rating={restaurantObject?.reviews && restaurantObject?.reviews?.length === 0 ? 0 : restaurantObject.reviews && restaurantObject?.reviews[0]?.rating} />
        {/* map view */}
        <View style={styles(currentTheme).mapContainer}>
          <MapView style={styles().flex} scrollEnabled={false} zoomEnabled={false} zoomControlEnabled={false} rotateEnabled={false} cacheEnabled={false} initialRegion={RestAbout.map} customMapStyle={customMapStyle} provider={PROVIDER_DEFAULT} />
          <View style={styles().marker}>
            <CustomMarker width={80} height={80} transform={[{ translateY: -20 }]} translateY={-20} />
          </View>
        </View>

        {/* other details */}
        <View style={[styles().flex, styles(currentTheme).mainContainer]}>
          <View>
            <View style={styles(currentTheme).subContainer}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <TextDefault
                  isRTL
                  H3
                  bolder
                  textColor={currentTheme.fontThirdColor}
                >
                  {typeName == "RestaurantPreview" ? RestAbout.name : restaurantObject?.restaurantName}
                </TextDefault>
              </View>
              <FavoriteButton iconSize={scale(24)} restaurantId={RestAbout.id} />
            </View>

            <View style={alignment.MTxSmall}>
              {todayOpeningTimes && (
                <View style={styles(currentTheme).timingRow}>
                  <View>
                    <AntDesign name='clockcircle' size={12} color={!IsOpen ? currentTheme.red600 : currentTheme.main} />
                  </View>
                  <TextDefault
                    isRTL
                    textColor={currentTheme.fontThirdColor}
                    H5
                    bold
                  >
                    {t(todayOpeningTimes?.day)}{' '}
                  </TextDefault>
                  {todayOpeningTimes?.times?.length < 1 ? (
                    <TextDefault isRTL small bold center>
                      {t('ClosedAllDay')}
                    </TextDefault>
                  ) : (
                    todayOpeningTimes?.times?.map((timing, index) => (
                      <TextDefault isRTL key={index} textColor={currentTheme.fontThirdColor} H5 bold>
                        {timing.startTime[0]}:{timing.startTime[1]} - {timing.endTime[0]}:{timing.endTime[1]}
                      </TextDefault>
                    ))
                  )}
                </View>
              )}
            </View>

            <View style={alignment.MTsmall}>
              <TextDefault
                isRTL
                textColor={currentTheme.fontThirdColor}
                H5
                bold
              >
                {t('preservationText')}
              </TextDefault>
            </View>
          </View>

          <View>
            <View style={alignment.MTlarge}>
              <TextDefault
                isRTL
                H3
                bolder
                textColor={currentTheme.fontThirdColor}
              >
                {t('location')}
              </TextDefault>
            </View>
            <View style={alignment.MTsmall}>
              <TextDefault
                isRTL
                textColor={currentTheme.fontThirdColor}
                H5
                bold
              >
                {restaurantObject.address}
              </TextDefault>
            </View>
          </View>

          <View>
            <View style={alignment.MTlarge}>
              <TextDefault
                isRTL
                H3
                textColor={currentTheme.fontThirdColor}
                bolder
              >
                {t('openingHours')}
              </TextDefault>
            </View>

            <View style={styles().timingContainer}>
              {restaurantObject.openingTimes.map((v, index) => (
                <View key={index} style={styles(currentTheme).timingRowMain}>
                  <TextDefault isRTL style={styles().timingText} textColor={currentTheme.fontThirdColor} bolder large>
                    {t(v.day)}{' '}
                  </TextDefault>
                  {v?.times?.length < 1 ? (
                    <TextDefault isRTL key={index + 8} small bold center>
                      {t('ClosedAllDay')}
                    </TextDefault>
                  ) : (
                    v?.times?.map((t) => (
                      <TextDefault isRTL key={index + 8} textColor={currentTheme.fontThirdColor} large>
                        {t.startTime[0]}:{t.startTime[1]}
                        {' - '}
                        {t.endTime[0]}:{t.endTime[1]}
                      </TextDefault>
                    ))
                  )}
                </View>
              ))}
            </View>
          </View>

          <View>
            <View style={[alignment.MTlarge]}>
              <TextDefault
                isRTL
                H3
                bolder
                textColor={currentTheme.fontThirdColor}
              >
                {t('deliveryInformation')}
              </TextDefault>
            </View>
            <View style={alignment.MTsmall}>
              <TextDefault isRTL H5 textColor={currentTheme.fontThirdColor} bold style={alignment.MTxSmall}>
                {t('minimumOrder')} {configuration.currencySymbol}
                {typeName == "RestaurantPreview" ? RestAbout.minimumOrder :restaurantObject.restaurantMinOrder}
              </TextDefault>

              <TextDefault isRTL H5 textColor={currentTheme.fontThirdColor} bold style={alignment.MTxSmall}>
                {t('delivery')} {typeName == "RestaurantPreview" ? RestAbout.deliveryTime : restaurantObject.deliveryTime} {t('Min')}
              </TextDefault>

              <TextDefault isRTL H5 textColor={currentTheme.fontThirdColor} bold style={alignment.MTxSmall}>

                {t('salesTax')} {configuration.currencySymbol}
                {typeName == "RestaurantPreview" ? RestAbout.tax : restaurantObject.restaurantTax}
              </TextDefault>
            </View>
          </View>

          <View>
            <View style={alignment.MTlarge}>
              <TextDefault
                isRTL
                H3
                bolder
                textColor={currentTheme.fontThirdColor}
              >
                {t('contact')}
              </TextDefault>
            </View>

            <View style={alignment.MTsmall}>
              <TextDefault
                isRTL
                textColor={currentTheme.fontThirdColor}
                H5
                bold
              >
                {t('restrictionsInstructions')}
              </TextDefault>
            </View>

            <View
              style={[styles(currentTheme).subContainer, alignment.MTsmall]}
            >
              <View>
                <TextDefault isRTL H5 bold>
                  {t('restaurant')}
                </TextDefault>
              </View>
              {RestAbout?.phone ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${RestAbout?.phone}`)
                  }}
                >
                  <TextDefault isRTL H5 bold textColor={currentTheme.linkColor}>
                    {RestAbout?.phone}
                  </TextDefault>
                </TouchableOpacity>
              ) : (
                <TextDefault isRTL H5 bold textColor={currentTheme.linkColor}>
                  {t('none')}
                </TextDefault>
              )}
            </View>

            <View style={styles().line} />


            <View style={[styles(currentTheme).subContainer, alignment.MTsmall]}>
              <View>
                <TextDefault isRTL H5 bold>
                  {t('website')}
                </TextDefault>
              </View>
              {RestAbout?.restaurantUrl ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(RestAbout?.restaurantUrl)
                  }}
                >
                  <TextDefault isRTL H5 bold textColor={currentTheme.linkColor}>
                    {t('viewWebsite')}
                  </TextDefault>
                </TouchableOpacity>
              ) : (
                <TextDefault isRTL H5 bold textColor={currentTheme.linkColor}>
                  {t('none')}
                </TextDefault>
              )}
            </View>
          </View>

          <View style={styles().line} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default About
