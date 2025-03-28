import React, { useState, useRef, useContext, useEffect } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import { useQuery } from '@apollo/client'
import CategoryPageHeader from './CategoryHeader/CategoryHeader'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import callStyles from './styles'
import { GET_SUB_CATEGORIES } from '../../apollo/queries'
import { useRestaurant } from '../../ui/hooks'
import ConfigurationContext from '../../context/Configuration'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import SearchOverlay from '../SearchOverlay/searchOverlay'
import UserContext from '../../context/User'
import { scale } from '../../utils/scaling'
import { Text } from 'react-native-paper'
import FoodItem from './FoodItem/FoodItem'
import LottieView from 'lottie-react-native'
import { Easing } from 'react-native-reanimated'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const ITEM_WIDTH = 100
const MAX_CHAR_LEN = 20

// Food Item Skeleton Component
const FoodItemSkeleton = ({ currentTheme }) => {
  const animatedOpacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <View style={styles.foodItemContainer}>
      <Animated.View
        style={[
          styles.foodItemCard,
          {
            backgroundColor: currentTheme?.cardBackground || '#fff',
            opacity: animatedOpacity
          }
        ]}
      >
        <Animated.View
          style={[
            styles.addButton,
            { backgroundColor: currentTheme?.plusIcon || '#000' }
          ]}
        />
        <Animated.View
          style={[
            styles.imageContainer,
            { backgroundColor: currentTheme?.gray || '#ddd' }
          ]}
        />
        <View style={styles.detailsContainer}>
          <Animated.View
            style={[
              styles.priceSkeleton,
              { backgroundColor: currentTheme?.gray || '#ddd' }
            ]}
          />
          <Animated.View
            style={[
              styles.titleSkeleton,
              { backgroundColor: currentTheme?.gray || '#ddd' }
            ]}
          />
        </View>
      </Animated.View>
    </View>
  )
}

// Food Items Grid Skeleton
const FoodItemsGridSkeleton = ({ currentTheme, count = 16 }) => {
  return (
    <View style={styles.foodList}>
      <FlatList
        data={Array(count).fill(0)}
        keyExtractor={(_, index) => `skeleton-${index}`}
        numColumns={2}
        scrollEnabled={true}
        renderItem={() => <FoodItemSkeleton currentTheme={currentTheme} />}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 20 }}
      />
    </View>
  )
}

const CategoryPage = ({ route, navigation }) => {
  // Params
  const { restaurantName, deliveryTime, category, restaurantId } = route.params

  // States
  const [initialRender, setInitialRender] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [subCategories, setSubCategories] = useState([])
  const [tabs, setTabs] = useState([])
  const [filteredFood, setFilteredFood] = useState([])
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(0)
  const [isChangingCategory, setIsChangingCategory] = useState(false)

  // Ref
  const translateX = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(1)).current // For fading effect
  const categoryScrollRef = useRef(null)
  const subcategoryScrollRef = useRef(null)
  const swipeInProgress = useRef(false)

  // Hooks
  const { t, i18n } = useTranslation()

  // Context
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { cartCount } = useContext(UserContext)

  // Constants
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const NO_ITEM_AVAILABLE = require('../../assets/SVG/ItemUnavailable.json')

  const { data: restaurantData, loading: restaurantLoading } =
    useRestaurant(restaurantId)
  const { data: subcategoriesData, loading: subcategoriesLoading } =
    useQuery(GET_SUB_CATEGORIES)

  // Handlers
  const handleOpenSearch = () => {
    setIsSearchVisible(true)
  }
  const handleCloseSearch = () => {
    setIsSearchVisible(false)
  }

  // Swipe Handlers
  const handleSwipe = (event, state) => {
    if (state === State.ACTIVE) {
      translateX.setValue(event.translationX)
    }

    if (state === State.END && !swipeInProgress.current) {
      swipeInProgress.current = true
      const swipeDistance = event.translationX
      const threshold = ITEM_WIDTH
      const swipeValue = 1 //filteredFood.length > 1 ? 4 : 2
      if (swipeDistance < -threshold) {
        if (canSwipeNext()) {
          animateSwipe(-ITEM_WIDTH * swipeValue)
          setTimeout(() => {
            changeSelection(1)
          }, 200)
        } else {
          animateSwipe(0)
        }
      } else if (swipeDistance > threshold) {
        if (canSwipePrevious()) {
          animateSwipe(ITEM_WIDTH * swipeValue)
          setTimeout(() => {
            changeSelection(-1)
          }, 200)
        } else {
          animateSwipe(0)
        }
      } else {
        animateSwipe(0)
      }

      setTimeout(() => (swipeInProgress.current = false), 200)
    }
  }

  const animateSwipe = (toValue) => {
    Animated.timing(translateX, {
      toValue: toValue, // Move to right
      duration: 100,
      useNativeDriver: true
    }).start(() => {
      // Fade out after moving
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        // Wait for 2 seconds before resetting
        setTimeout(() => {
          translateX.setValue(0) // Reset position
          opacity.setValue(1) // Make it visible again
        }, 500)
      })
    })
  }

  const changeSelection = (direction) => {
    setIsChangingCategory(true) // Set loading state when changing categories

    // Check if we're in the last category
    const isLastCategory = selectedCategoryIndex === tabs.length - 1

    let newSubIndex = selectedSubcategoryIndex + direction

    // Check if there are subcategories for the current category and we can move within them
    if (
      subCategories[selectedCategoryIndex]?.length > 0 &&
      newSubIndex >= 0 &&
      newSubIndex < subCategories[selectedCategoryIndex].length
    ) {
      // For the last category, we need special handling
      if (isLastCategory) {
        // First, clear the current food items and show loading
        setFilteredFood([])
        setIsDataLoading(true)

        // Use setTimeout to ensure the state updates in the correct order
        setTimeout(() => {
          setSelectedSubcategoryIndex(newSubIndex)

          // After updating subcategory index, filter the food items
          const selectedCategory = restaurantData.restaurant.categories.find(
            (category) => category._id === tabs[selectedCategoryIndex]?._id
          )

          if (selectedCategory) {
            const selectedSubCategoryId =
              subCategories[selectedCategoryIndex][newSubIndex]?._id

            const filteredFoods = selectedCategory.foods.filter(
              (food) => food.subCategory === selectedSubCategoryId
            )

            // Add a small delay before updating filtered foods
            setTimeout(() => {
              setFilteredFood(filteredFoods)
              setIsDataLoading(false)
              setIsChangingCategory(false)
            }, 300)
          } else {
            setIsDataLoading(false)
            setIsChangingCategory(false)
          }
        }, 50)
      } else {
        // For other categories, use the normal flow
        setSelectedSubcategoryIndex(newSubIndex)
      }

      scrollToSelected(subcategoryScrollRef, newSubIndex, true)
      return
    }

    // If we need to change categories
    let newCategoryIndex = selectedCategoryIndex + direction
    if (newCategoryIndex >= 0 && newCategoryIndex < tabs.length) {
      setSelectedCategoryIndex(newCategoryIndex)
      setSelectedSubcategoryIndex(0) // Reset to first subcategory
      scrollToSelected(categoryScrollRef, newCategoryIndex, false)
    }
  }

  const canSwipeNext = () => {
    // Check if there's a next subcategory in the current category
    if (subCategories[selectedCategoryIndex]?.length > 0) {
      if (
        selectedSubcategoryIndex <
        subCategories[selectedCategoryIndex].length - 1
      ) {
        return true
      }
    }

    // Check if there's a next category
    return selectedCategoryIndex < tabs.length - 1
  }

  const canSwipePrevious = () => {
    // Check if there's a previous subcategory in the current category
    if (selectedSubcategoryIndex > 0) {
      return true
    }

    // Check if there's a previous category
    return selectedCategoryIndex > 0
  }

  // Scroll Handler
  const scrollToSelected = (scrollRef, index, isSubCategory = false) => {
    if (scrollRef.current) {
      // Use different widths for categories vs subcategories
      const itemWidth = isSubCategory ? 120 : 180
      scrollRef.current.scrollTo({ x: index * itemWidth, animated: true })
    }
  }

  // Get Category and Sub Category
  const getSubCategoriesAndTabs = () => {
    if (
      !restaurantData?.restaurant?.categories ||
      !subcategoriesData?.subCategories
    )
      return

    let categories = []
    let subCategoriesForTabs = []

    if (restaurantData?.restaurant?.categories) {
      for (let category of restaurantData.restaurant.categories) {
        categories.push({ _id: category._id, name: category.title })

        const subcategories = subcategoriesData?.subCategories?.filter(
          (sub) => sub.parentCategoryId === category._id
        )

        subCategoriesForTabs.push(
          subcategories?.length > 0 ? subcategories : []
        )
      }
    }

    if (category) {
      // Find the correct category index - this now checks both _id and id properties
      const ctgryIndex = categories.findIndex(
        (cat) => cat._id === category.id || cat._id === category._id
      )

      if (ctgryIndex !== -1) {
        setSelectedCategoryIndex(ctgryIndex)
        setSelectedSubcategoryIndex(0)

        // Add a small delay to ensure the component has rendered before scrolling
        setTimeout(() => {
          scrollToSelected(categoryScrollRef, ctgryIndex, false)
        }, 300)
      }
    }

    setTabs(categories)
    setSubCategories(subCategoriesForTabs)
  }

  // Memorized FlatList component
  const MemoizedFlatList = React.memo(({ data }) => {
    // Animated items component
    const AnimatedItem = ({ index, children }) => {
      const itemOpacity = useRef(new Animated.Value(0)).current

      useEffect(() => {
        Animated.timing(itemOpacity, {
          toValue: 1,
          delay: index * 40,
          duration: 500,
          useNativeDriver: true
        }).start()
      }, [])

      return (
        <Animated.View style={{ opacity: itemOpacity }}>
          {children}
        </Animated.View>
      )
    }

    if (isDataLoading || isChangingCategory) {
      return <FoodItemsGridSkeleton currentTheme={currentTheme} count={6} />
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => {
          return item._id
        }}
        numColumns={2}
        scrollEnabled={true}
        style={styles.foodList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <AnimatedItem index={index}>
              <View style={styles.foodItemContainer} key={item?._id}>
                <FoodItem
                  item={item}
                  currentTheme={currentTheme}
                  configuration={configuration}
                  onPress={() => {
                    navigation.navigate('ItemDetail', {
                      food: {
                        ...item,
                        restaurant: restaurantId,
                        restaurantName: restaurantData?.restaurant?.name
                      },
                      addons: restaurantData?.restaurant?.addons || [],
                      options: restaurantData?.restaurant?.options || [],
                      restaurant: restaurantId
                    })
                  }}
                />
              </View>
            </AnimatedItem>
          )
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {!initialRender && (
              <>
                <LottieView
                  source={NO_ITEM_AVAILABLE}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text
                  style={{
                    color:
                      callStyles(currentTheme).backgroundColor === '#000'
                        ? 'white'
                        : 'black',
                    fontSize: 20
                  }}
                >
                  No Items Available
                </Text>
              </>
            )}
          </View>
        }
        columnWrapperStyle={{ gap: 10 }} // Adjust gap between columns
        contentContainerStyle={{
          gap: 20,
          paddingHorizontal: 3
        }} // Adjust gap between rows
      />
    )
  })

  // Use Effects
  useEffect(() => {
    if (
      !restaurantData?.restaurant?.categories ||
      !tabs[selectedCategoryIndex] ||
      !subCategories[selectedCategoryIndex]?.[selectedSubcategoryIndex]
    ) {
      return
    }

    setIsDataLoading(true)

    const selectedCategory = restaurantData.restaurant.categories.find(
      (category) => category._id === tabs[selectedCategoryIndex]?._id
    )

    if (!selectedCategory) {
      console.log('No matching category found.')
      return
    }

    const filteredFoods = selectedCategory.foods.filter(
      (food) =>
        food.subCategory ===
        subCategories[selectedCategoryIndex][selectedSubcategoryIndex]?._id
    )

    // Simulate loading time with a delay
    setTimeout(() => {
      setFilteredFood(filteredFoods)
      setIsDataLoading(false)
      setIsChangingCategory(false)
    }, 800) // Delay to show skeleton
  }, [
    restaurantData?.restaurant?.categories,
    selectedCategoryIndex,
    selectedSubcategoryIndex,
    tabs.length,
    subCategories.length,
    category
  ])

  useEffect(() => {
    getSubCategoriesAndTabs()
  }, [restaurantData?.restaurant?.categories, subcategoriesData?.subCategories])

  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [cartCount])

  useEffect(() => {
    if (initialRender) {
      setTimeout(() => {
        setInitialRender(false)
      }, 5000)
    }
  }, [filteredFood.length])

  return (
    <>
      <PanGestureHandler
        onHandlerStateChange={(event) =>
          handleSwipe(event.nativeEvent, event.nativeEvent.state)
        }
      >
        <View style={callStyles(currentTheme).container}>
          <StatusBar
            barStyle={
              themeContext.ThemeValue === 'Dark'
                ? 'light-content'
                : 'dark-content'
            }
            backgroundColor='transparent'
            translucent={true}
          />

          <CategoryPageHeader
            navigation={navigation}
            restaurantName={restaurantName}
            deliveryTime={deliveryTime}
            currentTheme={currentTheme}
            onOpenSearch={handleOpenSearch}
          />

          <View
            style={[
              styles.container,
              { backgroundColor: callStyles(currentTheme).backgroundColor }
            ]}
          >
            {/* Category List */}
            <ScrollView
              horizontal
              ref={categoryScrollRef}
              showsHorizontalScrollIndicator={false}
            >
              <View
                style={[
                  callStyles(currentTheme).container2,
                  { minWidth: SCREEN_WIDTH }
                ]}
              >
                {tabs?.map((tab, index) => (
                  <TouchableOpacity
                    key={tab._id}
                    style={[
                      callStyles(currentTheme).categoryItem,
                      selectedCategoryIndex === index &&
                        callStyles(currentTheme).selectedCategoryItem
                    ]}
                    onPress={() => {
                      setSelectedCategoryIndex(index)
                      setSelectedSubcategoryIndex(0)
                      setIsChangingCategory(true)
                      scrollToSelected(categoryScrollRef, index, false)
                    }}
                  >
                    <TextDefault
                      style={[
                        callStyles(currentTheme).categoryText,
                        selectedCategoryIndex === index &&
                          callStyles(currentTheme).selectedCategoryText
                      ]}
                      textColor={
                        selectedCategoryIndex === index
                          ? currentTheme.buttonText
                          : currentTheme.fontMainColor
                      }
                    >
                      {tab.name.length > MAX_CHAR_LEN
                        ? tab.name.slice(0, MAX_CHAR_LEN) + '...'
                        : tab.name}
                    </TextDefault>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Subcategory List */}
            {subCategories[selectedCategoryIndex]?.length > 0 && (
              <ScrollView
                horizontal
                ref={subcategoryScrollRef}
                showsHorizontalScrollIndicator={false}
                style={{
                  height: 40,
                  backgroundColor: callStyles(currentTheme).topSectionColor
                }}
              >
                <View style={[styles.subcategoryContainer]}>
                  {subCategories[selectedCategoryIndex]?.map((sub, index) => {
                    return (
                      <TouchableOpacity
                        key={sub._id}
                        style={[
                          callStyles(currentTheme).subcategoryItem,
                          selectedSubcategoryIndex === index &&
                            callStyles(currentTheme).selectedSubcategoryItem
                        ]}
                        onPress={() => {
                          setSelectedSubcategoryIndex(index)
                          setIsChangingCategory(true)
                          scrollToSelected(subcategoryScrollRef, index, true)
                        }}
                      >
                        <TextDefault
                          style={[
                            callStyles(currentTheme).subcategoryText,
                            selectedSubcategoryIndex === index &&
                              callStyles(currentTheme).selectedSubcategoryText
                          ]}
                          textColor={
                            selectedSubcategoryIndex === index
                              ? currentTheme.buttonText
                              : currentTheme.fontMainColor
                          }
                        >
                          {sub.title.length > MAX_CHAR_LEN
                            ? sub.title.slice(0, MAX_CHAR_LEN) + '...'
                            : sub.title}
                        </TextDefault>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            )}

            {/* Food Items List */}
            <Animated.View
              style={{
                ...styles.foodListView,
                backgroundColor: callStyles(currentTheme).backgroundColor,
                opacity,
                transform: [{ translateX: translateX }]
              }}
            >
              <MemoizedFlatList
                data={
                  subCategories[selectedCategoryIndex]?.length > 0
                    ? filteredFood
                    : restaurantData?.restaurant?.categories?.find(
                        (category) =>
                          category._id === tabs[selectedCategoryIndex]?._id
                      )?.foods
                }
              />
            </Animated.View>
          </View>

          {/* Search Overlay */}
          <SearchOverlay
            isVisible={isSearchVisible}
            onClose={handleCloseSearch}
            currentTheme={currentTheme}
            configuration={configuration}
            restaurant={restaurantData?.restaurant}
            navigation={navigation}
          />
        </View>
      </PanGestureHandler>

      {cartCount > 0 && (
        <View style={callStyles(currentTheme).buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={callStyles(currentTheme).button}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={callStyles().buttontLeft}>
              <Animated.View
                style={[
                  callStyles(currentTheme).buttonLeftCircle,
                  {
                    width: scale(18),
                    height: scale(18),
                    borderRadius: scale(9),
                    transform: [{ scale: scaleValue }]
                  }
                ]}
              >
                <Text
                  style={[
                    callStyles(currentTheme).buttonTextLeft,
                    { fontSize: scale(10) }
                  ]}
                >
                  {cartCount}
                </Text>
              </Animated.View>
            </View>
            <TextDefault
              style={callStyles().buttonText}
              textColor={currentTheme.buttonTextPink}
              uppercase
              center
              bolder
              small
            >
              {t('viewCart')}
            </TextDefault>
            <View style={callStyles().buttonTextRight} />
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items properly
    paddingHorizontal: 10
  },
  categoryTab: {
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height: 35, // Reduce tab height
    width: ITEM_WIDTH,
    justifyContent: 'center' // Center text
  },
  selectedTab: { borderBottomColor: 'blue' },
  categoryText: { fontSize: 14, fontWeight: 'bold' }, // Reduce font size
  subcategoryContainer: {
    height: 30, // Reduce height
    flexDirection: 'row',
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 5
  },
  subcategoryTab: {
    paddingVertical: 5, // Reduce padding
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#ddd',
    height: 35, // Reduce tab height
    width: ITEM_WIDTH,
    justifyContent: 'center' // Center text
  },
  selectedSubTab: { backgroundColor: 'blue' },
  subcategoryText: { fontSize: 10, fontWeight: 'bold', color: '#000' }, // Reduce font size
  // Food List
  foodListView: {
    height: SCREEN_HEIGHT,
    paddingBottom: 140,
    zIndex: 999
  },
  foodList: {
    margin: scale(10)
  },
  // Food Card Skeleton
  foodItemContainer: {
    flex: 1,
    marginBottom: 8
  },
  foodItemCard: {
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  imageContainer: {
    width: '100%',
    height: scale(150),
    borderRadius: 15
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 1
  },
  detailsContainer: {
    marginTop: 10,
    gap: 4
  },
  priceSkeleton: {
    width: '40%',
    height: 16,
    borderRadius: 3,
    marginBottom: 4
  },
  titleSkeleton: {
    width: '80%',
    height: 14,
    borderRadius: 3
  },
  // Empty Container
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyText: {
    fontSize: 16,
    color: 'gray'
  },
  lottie: {
    width: 250,
    height: 250
  },
  // Old
  foodItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  foodText: { fontSize: 16 }
})

export default CategoryPage
