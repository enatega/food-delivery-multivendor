import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { scale } from '../../utils/scaling'
import ImageHeader from '../../components/About/Header'
import styles from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextError from '../../components/Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import analytics from '../../utils/analytics'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

function About(props) {
  const Analytics = analytics()
  const { t } = useTranslation()
  const { restaurantObject, tab } = props.route.params
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const Reviews = restaurantObject.reviews || []
  const RestAbout = {
    name: restaurantObject.name,
    address: restaurantObject.address,
    map: {
      latitude: Number(restaurantObject.latitude),
      longitude: Number(restaurantObject.longitude),
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021
    }
  }

  const [pager, pagerSetter] = useState(tab)
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ABOUT)
    }
    Track()
  }, [])
  function emptyView() {
    return (
      <TextError
        text={t('noReviewYet')}
        backColor={currentTheme.cartContainer}
      />
    )
  }
  function line() {
    return <View style={{ ...alignment.MBmedium }} />
  }
  function header() {
    return (
      <>
        <TextDefault
          style={{ ...alignment.PBxSmall }}
          textColor={currentTheme.fontMainColor}
          bolder>
          {restaurantObject.total} {t('Reviews')}
        </TextDefault>
        {line()}
      </>
    )
  }
  function formatDate(date) {
    date = Number(date)
    date = new Date(date)
    return date.toDateString()
  }

  function AboutTab() {
    return (
      <ScrollView style={{ ...alignment.MTmedium }}>
        <View style={styles(currentTheme).mapMainContainer}>
          <View
            style={[
              styles(currentTheme).inlineFloat,
              styles(currentTheme).MB15
            ]}>
            <MaterialIcons
              name="location-on"
              size={30}
              color={currentTheme.darkBgFont}
            />
            <TextDefault
              style={styles(currentTheme).width90}
              large
              bold
              textColor={currentTheme.darkBgFont}>
              {RestAbout.address}
            </TextDefault>
          </View>
          <View style={[styles(currentTheme).MB15]}>
            <View
              style={[styles(currentTheme).inlineFloat, alignment.MBxSmall]}>
              <MaterialIcons
                name="access-time"
                size={30}
                color={currentTheme.darkBgFont}
              />
              <TextDefault
                style={{ paddingLeft: 10 }}
                bold
                textColor={currentTheme.darkBgFont}>
                {t('Openingtimes')}
              </TextDefault>
            </View>

            <View style={styles().timingContainer}>
              {restaurantObject.openingTimes.map((v, index) => (
                <View key={index} style={styles().timingRow}>
                  <TextDefault
                    style={styles().timingText}
                    textColor={currentTheme.black}
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

  function ReviewTab() {
    return (
      <FlatList
        contentContainerStyle={styles(currentTheme).mapMainContainer}
        data={Reviews}
        ListEmptyComponent={emptyView}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={header}
        ItemSeparatorComponent={line}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles(currentTheme).review}>
            <View style={styles().reviewerContainer}>
              <TextDefault
                style={styles().reviewerName}
                textColor={currentTheme.white}
                bolder>
                {item.order.user.name}
              </TextDefault>
              <View style={styles().ratingContainer}>
                {Array(5)
                  .fill(1)
                  .map((value, index) => {
                    if (index < item.rating) {
                      return (
                        <MaterialIcons
                          key={index}
                          name="star"
                          size={scale(13)}
                          color={currentTheme.starRating}
                        />
                      )
                    } else if (index >= item.rating && index < 5) {
                      return (
                        <MaterialIcons
                          key={index}
                          name="star"
                          size={scale(13)}
                          color={currentTheme.white}
                        />
                      )
                    }
                  })}
              </View>
            </View>
            <TextDefault
              style={styles().dateReview}
              textColor={currentTheme.secondaryBackground}
              numberOfLines={1}
              small>
              {formatDate(item.createdAt)}
            </TextDefault>
            <TextDefault textColor={currentTheme.white} small bold>
              {item.description}
            </TextDefault>
          </View>
        )}
      />
    )
  }
  return (
    <SafeAreaView
      style={[
        styles().flex,
        { backgroundColor: currentTheme.headerMenuBackground }
      ]}>
      {
        <ImageHeader
          iconColor={currentTheme.iconColorPink}
          svgNameL="leftArrow"
          restaurantImage={restaurantObject.restaurantImage}
          iconBackColor={currentTheme.white}
          restaurantName={restaurantObject.restaurantName}
          deliveryTime={restaurantObject.deliveryTime}
          total={restaurantObject.total}
          rating={
            restaurantObject.reviews.length == 0
              ? 0
              : restaurantObject.reviews[0].rating
          }
        />
      }
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <View style={styles().navigationContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => pagerSetter(true)}
            style={[
              styles(currentTheme).tab,
              pager && styles(currentTheme).selectedTab
            ]}>
            <TextDefault
              textColor={pager ? currentTheme.black : currentTheme.darkBgFont}
              bolder
              uppercase
              large>
              {t('About')}
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => pagerSetter(false)}
            style={[
              styles(currentTheme).tab,
              !pager && styles(currentTheme).selectedTab
            ]}>
            <TextDefault
              textColor={pager ? currentTheme.darkBgFont : currentTheme.black}
              bolder
              uppercase
              large>
              {t('Reviews')}
            </TextDefault>
          </TouchableOpacity>
        </View>

        {pager ? AboutTab() : ReviewTab()}
      </View>
    </SafeAreaView>
  )
}

export default About
