import React, { useContext, useState, useRef, useEffect } from 'react'
import { View, StatusBar, Animated, Dimensions, ActivityIndicator, ScrollView, StyleSheet, FlatList } from 'react-native'
import { useQuery } from '@apollo/client'
import CategoryPageHeader from './CategoryHeader/CategoryHeader'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import styles from './styles'
import { GET_SUB_CATEGORIES } from '../../apollo/queries'
import { useRestaurant } from '../../ui/hooks'
import ConfigurationContext from '../../context/Configuration'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import SearchOverlay from '../SearchOverlay/searchOverlay'
import UserContext from '../../context/User'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { scale } from '../../utils/scaling'
import { Text } from 'react-native-paper'
import FoodItem from './FoodItem/FoodItem'
import LottieView from 'lottie-react-native'
import Spinner from '../../components/Spinner/Spinner'
import { FOOD_TEMPLATE } from '../../utils/constants'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CategoryPage = ({ route, navigation }) => {
  const { t, i18n } = useTranslation()
  const { restaurantName, deliveryTime, category, restaurantId } = route.params
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const { cartCount } = useContext(UserContext)
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const scrollRef = useRef(null)
  const subScrollRef = useRef(null)
  const [subCategories, setSubCategories] = useState([])
  const [tabs, setTabs] = useState([])
  // const scrollRef2 = useRef(null)
  const [scrollWidth, setScrollWidth] = useState(0)
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const [filteredFood, setFilteredFood] = useState([])
  const scaleValue = useRef(new Animated.Value(1)).current
  const tabItemRef = useRef(null)
  const [isSubTabClicked, setIsSubTabClicked] = useState(false)

  // Scroll Tab Ref
  const tabScrollRef = useRef(null)
  const subTabScrollRef = useRef(null)

  imagePath = require('../../assets/SVG/ItemUnavailable.json')

  const { data: restaurantData, loading: restaurantLoading } = useRestaurant(restaurantId)
  const { data: subcategoriesData, loading: subcategoriesLoading } = useQuery(GET_SUB_CATEGORIES)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const handleOpenSearch = () => {
    setIsSearchVisible(true)
  }

  const handleCloseSearch = () => {
    setIsSearchVisible(false)
  }

  const scrollToTab = (index) => {
    setTimeout(() => {}, 200)
  }

  const changeTab = (i) => {
    setIndex(i)
    setSubIndex(0)
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * i, animated: true })
    scrollToTab(i)
  }

  const changeSubTab = (i) => {
    setSubIndex(i)
    setIsSubTabClicked(true)
    subScrollRef.current?.scrollTo({ x: SCREEN_WIDTH * i, animated: true })
  }

  const getSubCategoriesAndTabs = () => {
    if (!restaurantData?.restaurant?.categories || !subcategoriesData?.subCategories) return

    let categories = []
    let subCategoriesForTabs = []

    if (restaurantData?.restaurant?.categories) {
      for (let category of restaurantData.restaurant.categories) {
        categories.push({ _id: category._id, name: category.title })

        const subcategories = subcategoriesData?.subCategories?.filter((sub) => sub.parentCategoryId === category._id)

        subCategoriesForTabs.push(subcategories?.length > 0 ? subcategories : [])
      }
    }

    if (category) {
      const ctgryIndex = categories.findIndex((cat) => cat._id === category.id)
      setIndex(ctgryIndex)
      setSubIndex(0)
      setTimeout(() => {
        if (scrollRef.current)
          scrollRef.current.scrollTo({
            x: SCREEN_WIDTH * ctgryIndex,
            animated: true
          })
        if (tabScrollRef.current) {
          tabScrollRef.current.scrollTo({
            x: ctgryIndex * (scrollWidth / tabs.length),
            animated: true
          })
        }
      }, 200)
      scrollToTab(ctgryIndex)
    }

    setTabs(categories)
    setSubCategories(subCategoriesForTabs)
  }

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
    getSubCategoriesAndTabs()
  }, [restaurantData?.restaurant?.categories, subcategoriesData?.subCategories])

  // Scroll to active tab when index changes
  useEffect(() => {
    if (tabScrollRef.current) {
      tabScrollRef.current.scrollTo({
        x: index * 90, // Adjust width dynamically
        animated: true
      })
    }
  }, [index])

  // Scroll to active sub-tab when subIndex changes
  useEffect(() => {
    if (subTabScrollRef.current) {
      subTabScrollRef.current.scrollTo({
        x: subIndex * 90, // Adjust width dynamically
        animated: true
      })
    }
  }, [subIndex])

  const renderItem = ({ item, index }) => {
    if (index % 2 === 0) {
      return (
        <View style={styles(currentTheme).rowContainer}>
          <FoodItem
            item={item}
            currentTheme={currentTheme}
            configuration={configuration}
            onPress={() =>
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
            }
          />
        </View>
      )
    }
    return null
  }

  useEffect(() => {
    if (!restaurantData?.restaurant?.categories || !tabs[index] || !subCategories[index]?.[subIndex]) {
      return
    }

    setIsDataLoading(true)

    const selectedCategory = restaurantData.restaurant.categories.find((category) => category._id === tabs[index]?._id)

    if (!selectedCategory) {
      console.log('No matching category found.')
      return
    }

    const filteredFoods = selectedCategory.foods.filter((food) => food.subCategory === subCategories[index][subIndex]?._id)

    setFilteredFood(filteredFoods)
    setTimeout(() => {
      setIsDataLoading(false)
    }, 1000)
  }, [restaurantData?.restaurant?.categories, index, subIndex, tabs.length, subCategories.length, category])

  if (restaurantLoading || subcategoriesLoading) {
    return (
      <View style={[styles(currentTheme).container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size='large' color={currentTheme.tagColor} />
      </View>
    )
  }

  // Constants
  const total_filtered_items = filteredFood.length

  // Memoized List
  const MemoizedFlatList = React.memo(({ data, total_filtered_items }) => (
    <FlatList
      data={data}
      keyExtractor={(item) => {
        return item._id
      }}
      numColumns={2}
      scrollEnabled={true}
      style={stylesb.foodList}
      renderItem={({ item, index }) => {
        return (
          <View style={stylesb.foodItemContainer} key={item?._id}>
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
        )
      }}
      ListEmptyComponent={
        <View style={stylesb.emptyContainer}>
          <Text style={stylesb.emptyText}>No food items available</Text>
        </View>
      }
      // contentContainerStyle={{ paddingHorizontal: 10 }}
      columnWrapperStyle={{ gap: 10 }} // Adjust gap between columns
      contentContainerStyle={{
        gap: 20
        // paddingHorizontal: 10
      }} // Adjust gap between row
    />
  ))

  return (
    <View style={styles(currentTheme).container}>
      <StatusBar barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} backgroundColor='transparent' translucent={true} />

      <CategoryPageHeader navigation={navigation} restaurantName={restaurantName} deliveryTime={deliveryTime} currentTheme={currentTheme} onOpenSearch={handleOpenSearch} />

      <View style={stylesb.container}>
        {/* Fixed Header with Tabs and Sub-Tabs */}
        <View style={stylesb.fixedHeader}>
          <ScrollView
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout
              setScrollWidth(width) // Capture the width of the ScrollView
            }}
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={[styles(currentTheme).container2, { minWidth: SCREEN_WIDTH }]} ref={tabItemRef}>
              {tabs?.map((tab, i) => (
                <TouchableOpacity key={tab._id} style={[styles(currentTheme).subcategoryItem, index === i && styles(currentTheme).selectedSubcategoryItem]} onPress={() => changeTab(i)}>
                  <TextDefault style={[styles(currentTheme).subcategoryText, index === i && styles(currentTheme).selectedSubcategoryText]} textColor={index === i ? currentTheme.buttonText : currentTheme.fontMainColor}>
                    {tab.name}
                  </TextDefault>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {subCategories[index]?.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={subTabScrollRef}>
              <View style={stylesb.subTabContainer}>
                {subCategories[index]?.map((v, i) => (
                  <TouchableOpacity
                    key={`subCategories-${i}`}
                    style={[styles(currentTheme).subcategoryItem, subIndex === i && styles(currentTheme).selectedSubcategoryItem]}
                    ref={tabItemRef}
                    onPress={() => {
                      changeSubTab(i)
                    }}
                  >
                    <TextDefault style={[styles(currentTheme).subcategoryText, subIndex === i && styles(currentTheme).selectedSubcategoryText]} textColor={subIndex === i ? currentTheme.buttonText : currentTheme.fontMainColor}>
                      {v.title}
                    </TextDefault>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Horizontal Scroll for Main Tabs */}
        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollRef}
          onMomentumScrollEnd={(e) => {
            setIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))
            setSubIndex(0)
          }}
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((_, i) => {
            return (
              <View key={`tabs-${i}`} style={stylesb.page}>
                {subCategories[i].length > 0 ? (
                  subCategories[i].length === 1 ? (
                    <View className='flex-1' style={stylesb.scrollContent}>
                      {subCategories[index]?.map((sub, j) => (
                        <View style={stylesb.foodListView} key={j}>
                          <FlatList
                            data={filteredFood}
                            keyExtractor={(item) => item._id}
                            numColumns={2}
                            scrollEnabled={true}
                            style={stylesb.foodList}
                            renderItem={({ item }) => {
                              return (
                                <View style={stylesb.foodItemContainer}>
                                  {i === 0 && (
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
                                  )}
                                </View>
                              )
                            }}
                            ListEmptyComponent={
                              <View style={stylesb.emptyContainer}>
                                <Text style={stylesb.emptyText}>No food items available</Text>
                              </View>
                            }
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                          />
                          {/* </ScrollView> */}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <ScrollView
                      horizontal
                      pagingEnabled
                      ref={subScrollRef}
                      style={stylesb.scrollContent}
                      contentContainerStyle={{
                        flexGrow: 1
                      }}
                      onMomentumScrollEnd={(e) => {
                        if (!isSubTabClicked) {
                          setSubIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))
                        } else {
                          setIsSubTabClicked(false)
                        }
                      }}
                      nestedScrollEnabled={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      {subCategories[index]?.map((sub, j) => {
                        return <View key={j} style={stylesb.foodListView}>{i === 0 && j == 0 ? <MemoizedFlatList data={filteredFood} total_filtered_items={total_filtered_items} /> : <MemoizedFlatList data={[]} total_filtered_items={total_filtered_items} />}</View>
                      })}
                    </ScrollView>
                  )
                ) : (
                  <ScrollView
                    horizontal
                    pagingEnabled
                    ref={subScrollRef}
                    style={stylesb.scrollContent2}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onMomentumScrollEnd={(e) => {
                      setSubIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View
                      style={{
                        ...stylesb.foodListView,
                        height: SCREEN_HEIGHT * 0.85,
                        margin: scale(8)
                      }}
                    >
                      <FlatList
                        data={restaurantData?.restaurant?.categories?.find((category) => category._id === tabs[index]?._id).foods}
                        keyExtractor={(item) => item._id}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <View key={item._id} style={stylesb.foodItemContainer}>
                            <FoodItem
                              item={item}
                              currentTheme={currentTheme}
                              configuration={configuration}
                              onPress={() =>
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
                              }
                            />
                          </View>
                        )}
                        ListEmptyComponent={
                          <View style={stylesb.emptyContainer}>
                            <LottieView
                              style={{
                                width: 250,
                                height: 250
                              }}
                              source={imagePath}
                              autoPlay
                              loop
                            />
                            <TextDefault>No Item Available at the moment</TextDefault>
                          </View>
                        }
                        // contentContainerStyle={{ paddingHorizontal: 10 }}
                        columnWrapperStyle={{ gap: 10 }} // Adjust gap between columns
                        contentContainerStyle={{ gap: 10 }} // Adjust gap between row
                      />
                    </View>
                  </ScrollView>
                )}
              </View>
            )
          })}
        </ScrollView>

        {/* )} */}
      </View>

      {/* Search Overlay */}
      <SearchOverlay isVisible={isSearchVisible} onClose={handleCloseSearch} currentTheme={currentTheme} configuration={configuration} restaurant={restaurantData?.restaurant} navigation={navigation} />

      {cartCount > 0 && (
        <View style={styles(currentTheme).buttonContainer}>
          <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).button} onPress={() => navigation.navigate('Cart')}>
            <View style={styles().buttontLeft}>
              <Animated.View
                style={[
                  styles(currentTheme).buttonLeftCircle,
                  {
                    width: scale(18),
                    height: scale(18),
                    borderRadius: scale(9),
                    transform: [{ scale: scaleValue }]
                  }
                ]}
              >
                <Text style={[styles(currentTheme).buttonTextLeft, { fontSize: scale(10) }]}>{cartCount}</Text>
              </Animated.View>
            </View>
            <TextDefault style={styles().buttonText} textColor={currentTheme.buttonTextPink} uppercase center bolder small>
              {t('viewCart')}
            </TextDefault>
            <View style={styles().buttonTextRight} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default CategoryPage

const stylesb = StyleSheet.create({
  container: {
    flex: 1
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 17,
    width: '100%',
    backgroundColor: 'red'
  },
  subTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 15
  },
  tab: {
    padding: 10
  },
  scrollContent: {
    marginTop: 130
    // backgroundColor: 'blue'
  },
  scrollContent2: {
    marginTop: 80
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    minHeight: 20000
  },
  foodItemContainer: { margin: 4 },
  foodList: {
    // backgroundColor: 'yellow',
    margin: scale(10)
  },
  foodListView: {
    height: SCREEN_HEIGHT * 0.8,
    paddingBottom: 140,
    zIndex: 999
    // backgroundColor: 'red'
  },
  text: {
    fontSize: 24,
    color: 'white'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyText: {
    fontSize: 16,
    color: 'gray'
  }
})
