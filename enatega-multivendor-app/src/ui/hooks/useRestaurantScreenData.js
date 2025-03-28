import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { gql, useQuery } from '@apollo/client'
import { escapeRegExp } from '../../utils/regex'
import { isOpen } from '../../utils/customFunctions'
import {
  popularItems,
  GET_SUB_CATEGORIES,
  food,
  popularFoodItems
} from '../../apollo/queries'

const POPULAR_ITEMS = gql`
  ${popularItems}
`
const FOOD = gql`
  ${food}
`
const POPULAR_FOOD_ITEMS = gql`
  ${popularFoodItems}
`

export const useRestaurantData = (
  restaurantId,
  propsData,
  data,
  client,
  navigation
) => {
  const { t } = useTranslation()
  const [selectedLabel, setSelectedLabel] = useState(0)
  const [buttonClicked, setButtonClicked] = useState(false)
  const [relatedSubCategories, setRelatedSubCategories] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedSubCtg, setSelectedSubCtg] = useState('')
  const [selectedPrntCtg, setSelectedPrntCtg] = useState('')

  // Queries
  const { data: popularItemsData } = useQuery(POPULAR_ITEMS, {
    variables: { restaurantId }
  })

  const { data: popularFoodsItems, loading: loadingPopularItems } = useQuery(
    POPULAR_FOOD_ITEMS,
    {
      variables: { restaurantId }
    }
  )

  // console.log("🚀 ~ popularFoodsItems:", JSON.stringify(popularFoodsItems))

  const { data: subCategoriesData, loading: subCategoriesLoading } = useQuery(
    GET_SUB_CATEGORIES,
    {
      onError: (error) => {
        FlashMessage({
          message: error.message || 'Failed to fetch sub-categories'
        })
      }
    }
  )

  const fetchFoodDetails = (itemId) => {
    try {
      return client.readFragment({ id: `Food:${itemId}`, fragment: FOOD })
    } catch (error) {
      console.error(`Error reading fragment for Food:${itemId}`, error)
      return null
    }
  }

  const dataList =
    popularItems &&
    popularItems?.popularItems?.map((item) => {
      const foodDetails = fetchFoodDetails(item?.id)
      return foodDetails
    })

  const processCategories = (restaurant) => {
    if (!restaurant)
      return { sortedDeals: [], merged_food_items: [], deals: [] }

    // First create the popular section
    const popularSection = {
      title: 'Popular',
      parentCategoryTitle: 'Popular',
      subCategoryTitle: null,
      foods: popularFoodsItems?.popularFoodItems || [] // Use the new resolver data
    }

    const allDeals =
      restaurant?.categories?.filter((cat) => cat?.foods?.length) || []
    const subCategories = subCategoriesData?.subCategories || []

    // Group subcategories
    const grouped_subcategories_obj = subCategories?.reduce((acc, sub_ctg) => {
      if (!acc[sub_ctg.parentCategoryId]) {
        acc[sub_ctg.parentCategoryId] = []
      }
      acc[sub_ctg.parentCategoryId].push(sub_ctg)
      return acc
    }, {})

    const grouped_subcategories_arr = Object.values(
      grouped_subcategories_obj
    ).flat()

    // Process parent categories
    const parentCategories =
      allDeals?.filter((ctg) =>
        grouped_subcategories_arr?.some(
          (sub_ctg) =>
            sub_ctg?.parentCategoryId !== ctg?._id &&
            ctg?.foods?.some(
              (_food) => _food?.subCategory !== sub_ctg?.parentCategoryId
            )
        )
      ) || []

    // Process food items without subcategories
    const foodItemsWithoutSubCtgs = allDeals.flatMap((ctg) => {
      const foodsWithoutSubCtgs =
        ctg?.foods?.filter(
          (food) => !food?.subCategory && !food?.isOutOfStock
        ) || []
      return foodsWithoutSubCtgs.length > 0
        ? [
            {
              parentCategoryTitle: ctg.title,
              subCategoryTitle: null,
              foods: foodsWithoutSubCtgs
            }
          ]
        : []
    })

    // Sort deals
    const map = new Map()
    const sortedDeals = allDeals.flatMap((ctg) => {
      if (!ctg?.foods?.length) return []

      return (
        grouped_subcategories_arr
          ?.filter((sub_ctg) => sub_ctg.parentCategoryId === ctg._id)
          .flatMap((sub_ctg) => {
            let item = {
              subCategoryTitle:
                ctg.foods?.some(
                  (fd) => fd?.subCategory === sub_ctg?._id && !fd.isOutOfStock
                ) && sub_ctg?.title,
              parentCategoryTitle: '',
              foods: sub_ctg?._id
                ? ctg.foods.filter(
                    (fd) => fd?.subCategory === sub_ctg?._id && !fd.isOutOfStock
                  )
                : ctg.foods.filter(
                    (fd) => fd?.subCategory === ctg?._id && !fd.isOutOfStock
                  )
            }

            if (
              ctg._id === sub_ctg?.parentCategoryId ||
              (ctg?._id !== null && sub_ctg?.parentCategoryId !== ctg?._id)
            ) {
              if (!map.get(ctg._id)) {
                item['parentCategoryTitle'] = ctg?.title
                map.set(ctg._id, true)
              }
            }
            return [item]
          }) || []
      )
    })
    // Merge all food items
    const merged_food_items = [
      popularSection,
      ...sortedDeals,
      ...foodItemsWithoutSubCtgs,
      ...parentCategories.map((ctg) => ({
        parentCategoryId: ctg?._id,
        subCategoryTitle: null,
        foods:
          ctg?.foods?.filter(
            (_food) => !_food.subCategory && !_food?.isOutOfStock
          ) || []
      }))
    ]


    return {
      sortedDeals,
      merged_food_items,
      deals: allDeals.map((c, index) => ({
        ...c,
        data: c.foods,
        index: dataList?.length > 0 ? index + 1 : index
      }))
    }
  }

  // Handle search
  useEffect(() => {
    if (!data?.restaurant) return
    // Get all deals and process them
    const { sortedDeals, merged_food_items } = processCategories(
      data?.restaurant
    )
    const deals = data?.restaurant?.categories?.map((c, index) => ({
      ...c,
      data: c.foods,
      index: dataList?.length > 0 ? index + 1 : index
    }))

    if (search === '') {
      const filteredData = []
      deals?.forEach((category) => {
        category.data?.forEach((food) => {
          filteredData.push(food)
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(false)
    } else if (deals) {
      const escapedSearchText = escapeRegExp(search)
      const regex = new RegExp(escapedSearchText, 'i')
      const filteredData = []

      deals.forEach((category) => {
        category.data?.forEach((food) => {
          const title = food.title.search(regex)
          if (title < 0) {
            const description = food.description.search(regex)
            if (description > 0) {
              filteredData.push(food)
            }
          } else {
            filteredData.push(food)
          }
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(true)
    }
  }, [search, searchOpen, data])

  // Check restaurant availability
  useEffect(() => {
    if (
      data?.restaurant &&
      (!data.restaurant.isAvailable || !isOpen(data.restaurant))
    ) {
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('backToRestaurants'),
            onPress: () => navigation.goBack(),
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
    }
  }, [data])

  // Search handlers
  const searchHandler = () => {
    const { merged_food_items } = processCategories(data?.restaurant)
    setSelectedPrntCtg(merged_food_items[0]?.parentCategoryTitle)
    setSelectedSubCtg(merged_food_items[0]?.subCategoryTitle)
    setSearchOpen(!searchOpen)
    setShowSearchResults(!showSearchResults)
  }

  const searchPopupHandler = () => {
    setSearchOpen(!searchOpen)
    setSearch('')
  }

  return {
    selectedLabel,
    setSelectedLabel,
    buttonClicked,
    setButtonClicked,
    relatedSubCategories,
    setRelatedSubCategories,
    searchOpen,
    search,
    setSearch,
    filterData,
    setFilterData,
    showSearchResults,
    setShowSearchResults,
    selectedSubCtg,
    setSelectedSubCtg,
    selectedPrntCtg,
    setSelectedPrntCtg,
    dataList,
    subCategoriesLoading,
    searchHandler,
    searchPopupHandler,
    processCategories,
    fetchFoodDetails
  }
}
