import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Entypo, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import Search from '../../../components/Main/Search/Search'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { textStyles } from '../../../utils/textStyles'
import styles from './styles'
import { resolveLogoImage } from '../../../utils/resolveImageUrl'

const AnimatedText = Animated.createAnimatedComponent(Text)

const CATEGORY_RAIL_HEIGHT = scale(56)

function normalizeCategories({ categories = [], topBarData = [], updatedDeals = [] }) {
  if (categories.length > 0) return categories

  const source = Array.isArray(updatedDeals) && updatedDeals.length > 0 ? updatedDeals : topBarData
  return (source ?? []).map((section, index) => ({
    key: `category-${section?.index ?? index}`,
    title: section?.title,
    categoryIndex: section?.index ?? index
  }))
}

function CategoryTabsBase({ categories, activeCategoryIndex, onPressCategory, currentTheme, t }) {
  const categoryListRef = useRef(null)
  const categoryLayoutsRef = useRef(new Map())
  const categoryContentWidthRef = useRef(0)
  const [categoryListWidth, setCategoryListWidth] = useState(0)
  const [layoutVersion, setLayoutVersion] = useState(0)

  useEffect(() => {
    if (!categoryListRef.current || categoryListWidth === 0) return
    const activeLayout = categoryLayoutsRef.current.get(activeCategoryIndex)
    if (!activeLayout) return

    const maxOffset = Math.max(0, categoryContentWidthRef.current - categoryListWidth)
    const centeredOffset = activeLayout.x + activeLayout.width / 2 - categoryListWidth / 2
    const offset = Math.min(Math.max(0, centeredOffset), maxOffset)

    categoryListRef.current.scrollTo({
      animated: true,
      x: offset,
      y: 0
    })
  }, [activeCategoryIndex, categoryListWidth, layoutVersion])

  if (!categories.length) return null

  return (
    <View
      style={styles(currentTheme).categoriesContainer}
      onLayout={(event) => {
        setCategoryListWidth(event.nativeEvent.layout.width)
      }}
    >
      <ScrollView
        ref={categoryListRef}
        horizontal
        inverted={currentTheme.isRTL}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(currentTheme).categoriesContent}
        keyboardShouldPersistTaps='handled'
        onContentSizeChange={(width) => {
          categoryContentWidthRef.current = width
          setLayoutVersion((value) => value + 1)
        }}
      >
        {categories.map((item) => {
          const isActive = item.categoryIndex === activeCategoryIndex

          return (
            <View
              key={item.key}
              onLayout={(event) => {
                categoryLayoutsRef.current.set(item.categoryIndex, event.nativeEvent.layout)
                setLayoutVersion((value) => value + 1)
              }}
              style={isActive ? styles(currentTheme).activeHeader : styles(currentTheme).inactiveHeader}
            >
              <RectButton
                rippleColor={currentTheme.rippleColor}
                onPress={() => onPressCategory(item.categoryIndex)}
                style={styles(currentTheme).headerContainer}
              >
                <TextDefault style={isActive ? textStyles.Bolder : textStyles.H5} textColor={isActive ? currentTheme.newButtonText : currentTheme.gray500} center H5>
                  {t(item.title)}
                </TextDefault>
              </RectButton>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

function resolveAboutObject({ aboutObject, restaurant, restaurantId, restaurantName, restaurantImage, minimumOrder, tax }) {
  if (aboutObject) return aboutObject

  return {
    latitude: restaurant ? restaurant.location?.coordinates?.[1] : '',
    longitude: restaurant ? restaurant.location?.coordinates?.[0] : '',
    address: restaurant ? restaurant.address : '',
    restaurantId,
    restaurantName,
    restaurantImage,
    restaurantLogo: resolveLogoImage(restaurant),
    restaurantCuisines: restaurant ? restaurant.cuisines : [],
    restaurantTax: tax,
    restaurantMinOrder: minimumOrder,
    deliveryTime: restaurant ? restaurant.deliveryTime : '...',
    minimumOrder: restaurant ? restaurant.minimumOrder : '...',
    average: restaurant ? restaurant?.reviewData?.ratings : '...',
    total: restaurant ? restaurant?.reviewData?.total : '...',
    reviews: restaurant ? restaurant?.reviewData?.reviews : '...',
    isAvailable: restaurant ? restaurant?.isAvailable : true,
    openingTimes: restaurant ? restaurant?.openingTimes : [],
    phone: restaurant ? restaurant?.phone : '',
    restaurantUrl: restaurant ? restaurant?.restaurantUrl : '',
    IsOpen: true,
    reviewsCount: restaurant ? restaurant?.reviewCount : '...',
    _id: restaurantId
  }
}

function HeaderContent({
  aboutObject,
  categories,
  activeCategoryIndex,
  onPressCategory,
  searchOpen,
  search,
  setSearch,
  searchHandler,
  searchPopupHandler,
  scrollY,
  insetTop,
  collapseDistance,
  displayedDeliveryMinutes,
  showCategories = true
}) {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(
    () => ({
      isRTL: i18n.dir() === 'rtl',
      ...theme[themeContext.ThemeValue]
    }),
    [i18n, themeContext.ThemeValue]
  )

  const topBarHeight = insetTop + scale(52)
  const headerHeight = topBarHeight + (showCategories && !searchOpen && categories.length > 0 ? CATEGORY_RAIL_HEIGHT : 0)

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderBottomColor: searchOpen ? currentTheme.newBorderColor : interpolateColor(scrollY.value, [0, collapseDistance * 0.3], ['rgba(0,0,0,0)', currentTheme.newBorderColor])
  }))

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: currentTheme.themeBackground,
    opacity: searchOpen ? 1 : interpolate(scrollY.value, [0, collapseDistance * 0.14, collapseDistance * 0.28], [0, 0.82, 1], Extrapolation.CLAMP)
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, collapseDistance * 0.35, collapseDistance * 0.8], [0, 0.5, 1], Extrapolation.CLAMP)
  }))

  return (
    <Animated.View style={[styles(currentTheme).container, containerAnimatedStyle, { height: headerHeight }]}>
      <Animated.View pointerEvents='none' style={[styles(currentTheme).backgroundFill, backgroundAnimatedStyle]} />
      <View style={[styles(currentTheme).topRow, { paddingTop: insetTop }]}>
        <View style={styles(currentTheme).leadingArea}>
          {searchOpen ? (
            <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).touchArea} onPress={searchPopupHandler}>
              <Entypo name='cross' color={currentTheme.newIconColor} size={scale(22)} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).touchArea} onPress={() => navigation.goBack()}>
              <Ionicons name='arrow-back' color={currentTheme.newIconColor} size={scale(22)} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles(currentTheme).centerArea}>
          {searchOpen ? (
            <Search setSearch={setSearch} search={search} newheaderColor={currentTheme.backgroundColor} cartContainer={currentTheme.gray500} placeHolder={t('searchItems')} />
          ) : (
            <AnimatedText numberOfLines={1} style={[styles(currentTheme).headerTitle, titleAnimatedStyle]}>
              {t('delivery')} {displayedDeliveryMinutes} {t('Min')}
            </AnimatedText>
          )}
        </View>

        <View
          style={[
            styles(currentTheme).trailingArea,
            { opacity: searchOpen ? 0 : 1 }
          ]}
          pointerEvents={searchOpen ? 'none' : 'auto'}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).touchArea}
            onPress={() => {
              navigation.navigate('About', {
                restaurantObject: { ...aboutObject },
                tab: false
              })
            }}
          >
            <SimpleLineIcons name='info' size={scale(17)} color={currentTheme.newIconColor} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).touchArea} onPress={searchHandler}>
            <Ionicons name='search-outline' style={{ fontSize: scale(20) }} color={currentTheme.newIconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {showCategories && !searchOpen && <CategoryTabsBase categories={categories} activeCategoryIndex={activeCategoryIndex} onPressCategory={onPressCategory} currentTheme={currentTheme} t={t} />}
    </Animated.View>
  )
}

function ImageHeader(props) {
  const resolvedAboutObject = resolveAboutObject(props)
  const resolvedCategories = normalizeCategories(props)
  const collapseDistance = props.collapseDistance ?? 0
  const scrollY = props.scrollY ?? { value: 0 }
  const insetTop = props.insetTop ?? props.topInset ?? 0
  const displayedDeliveryMinutes = props.displayedDeliveryMinutes ?? resolvedAboutObject.deliveryTime ?? '...'

  if (props.loading || props.topBarData || props.updatedDeals) {
    return (
      <HeaderContent
        aboutObject={resolvedAboutObject}
        categories={resolvedCategories}
        activeCategoryIndex={props.activeCategoryIndex ?? 0}
        onPressCategory={props.onPressCategory ?? (() => {})}
        searchOpen={props.searchOpen ?? false}
        search={props.search ?? ''}
        setSearch={props.setSearch ?? (() => {})}
        searchHandler={props.searchHandler ?? (() => {})}
        searchPopupHandler={props.searchPopupHandler ?? (() => {})}
        scrollY={props.translationY ?? scrollY}
        insetTop={insetTop}
        collapseDistance={collapseDistance}
        displayedDeliveryMinutes={displayedDeliveryMinutes}
        showCategories={props.showCategories ?? true}
      />
    )
  }

  return (
    <HeaderContent
      aboutObject={resolvedAboutObject}
      categories={resolvedCategories}
      activeCategoryIndex={props.activeCategoryIndex ?? 0}
      onPressCategory={props.onPressCategory ?? (() => {})}
      searchOpen={props.searchOpen ?? false}
      search={props.search ?? ''}
      setSearch={props.setSearch ?? (() => {})}
      searchHandler={props.searchHandler ?? (() => {})}
      searchPopupHandler={props.searchPopupHandler ?? (() => {})}
      scrollY={scrollY}
      insetTop={insetTop}
      collapseDistance={collapseDistance}
      displayedDeliveryMinutes={displayedDeliveryMinutes}
      showCategories={props.showCategories ?? true}
    />
  )
}

export const CategoryTabsRow = memo(function CategoryTabsRow({ categories, activeCategoryIndex, onPressCategory }) {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(
    () => ({
      isRTL: i18n.dir() === 'rtl',
      ...theme[themeContext.ThemeValue]
    }),
    [i18n, themeContext.ThemeValue]
  )

  return <CategoryTabsBase categories={categories} activeCategoryIndex={activeCategoryIndex} onPressCategory={onPressCategory} currentTheme={currentTheme} t={t} />
})

export default memo(ImageHeader)
