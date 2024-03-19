import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { scale } from '../../utils/scaling'
import ImageHeader from '../../components/About/Header'
import styles from './styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import analytics from '../../utils/analytics'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

function About(props) {
  const Analytics = analytics()
  const { t } = useTranslation()
  const { restaurantObject } = props.route.params
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const RestAbout = {
    name: restaurantObject.name,
    address: restaurantObject.address,
    deliveryTime: restaurantObject.deliveryTime,
    rating: restaurantObject.rating,
    average: restaurantObject.average,
    map: {
      latitude: Number(restaurantObject.latitude),
      longitude: Number(restaurantObject.longitude),
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021
    }
  }

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ABOUT)
    }
    Track()
  }, [])

  const inset = useSafeAreaInsets()

  return (
    <ScrollView
      style={[
        { marginTop: inset.top },
        styles().flex,
        { backgroundColor: currentTheme.headerMenuBackground }
      ]}>
      <ImageHeader
        iconColor={currentTheme.iconColorPink}
        svgNameL="leftArrow"
        restaurantImage={restaurantObject.restaurantImage}
        iconBackColor={currentTheme.white}
        restaurantName={restaurantObject.restaurantName}
        deliveryTime={restaurantObject.deliveryTime}
        total={restaurantObject.total}
        rating={
          restaurantObject.reviews.length === 0
            ? 0
            : restaurantObject.reviews[0].rating
        }
      />
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <View style={styles(currentTheme).restaurantInfo}>
          {!props.loading && (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <MaterialIcons
                name="timer"
                size={20}
                color={currentTheme.fontThirdColor}
              />
              <TextDefault H5 textColor={currentTheme.fontThirdColor} bold>
                {t('delivery')} {restaurantObject.deliveryTime} {t('Min')}
              </TextDefault>
            </View>
          )}
          <View style={styles().ratingContainer}>
            <MaterialIcons
              name="star-border"
              size={20}
              color={currentTheme.fontThirdColor}
            />

            <TextDefault
              style={{ paddingLeft: 4 }}
              textColor={currentTheme.fontThirdColor}
              H5
              bolder>
              {restaurantObject.average}
            </TextDefault>
            <TextDefault H5 textColor={currentTheme.fontThirdColor} bold>
              ({restaurantObject.total})
            </TextDefault>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4
            }}>
            <MaterialIcons
              name="location-on"
              size={20}
              color={currentTheme.fontThirdColor}
            />
            <TextDefault H5 bold textColor={currentTheme.fontThirdColor}>
              {RestAbout.address}
            </TextDefault>
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(8),
              gap: 4
            }}>
            <MaterialIcons
              name="access-time"
              size={20}
              color={currentTheme.fontThirdColor}
            />
            <TextDefault H5 textColor={currentTheme.fontThirdColor} bold>
              {t('Openingtimes')}:
            </TextDefault>
          </View>

          <View style={styles().timingContainer}>
            {restaurantObject.openingTimes.map((v, index) => (
              <View key={index} style={styles(currentTheme).timingRow}>
                <TextDefault
                  style={styles().timingText}
                  textColor={currentTheme.black}
                  bolder
                  large>
                  {t(v.day)}{' '}
                </TextDefault>
                {v.times.length < 1 ? (
                  <TextDefault key={index + 8} small bold center>
                    {t('ClosedAllDay')}
                  </TextDefault>
                ) : (
                  v.times.map(t => (
                    <TextDefault
                      key={index + 8}
                      textColor={currentTheme.black}
                      large>
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
        <View style={styles(currentTheme).mapContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              ...alignment.PBsmall
            }}>
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={currentTheme.fontThirdColor}
            />
            <TextDefault H5 bold textColor={currentTheme.fontThirdColor}>
              Location
            </TextDefault>
          </View>
          <MapView
            style={styles().flex}
            scrollEnabled={false}
            zoomEnabled={false}
            zoomControlEnabled={false}
            rotateEnabled={false}
            cacheEnabled={false}
            initialRegion={RestAbout.map}
            customMapStyle={
              themeContext.ThemeValue === 'Dark' ? mapStyle : null
            }
            provider={PROVIDER_GOOGLE}></MapView>
          <View style={styles().marker}>
            <CustomMarker
              width={40}
              height={40}
              transform={[{ translateY: -20 }]}
              translateY={-20}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default About
