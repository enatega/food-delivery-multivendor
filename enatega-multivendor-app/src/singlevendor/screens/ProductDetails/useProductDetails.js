import { useMutation, useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { useContext } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { UPDATE_USER_CART } from '../../apollo/mutations'

const useProductDetails = ({ foodId }) => {
  // Todo: need to fix variations related data.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId }
  })

  const [updateUserCart, { loading: updateUserCartLoading, error: updateUserCartError }] = useMutation(UPDATE_USER_CART, {
    onCompleted: (data) => {
      console.log('Cart updated:', data)
    },
    onError: (error) => {
      console.error('Error updating cart:', error)
    }
  })

  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const addItemToCart = (foodId,categoryId,variationId,addons,count) => {
    updateUserCart({
      variables: {
        input: {
          food: [
            {
              _id: foodId,
              categoryId: categoryId,
              variation: {
                _id: variationId,
                addons: addons,
                count: count
              }
            }
          ]
        }
      }
    })
  }

  console.log('useProductDetails data', data, error, foodId)
  const productInfoData = {
    id: data?.getFoodDetails?.id,
    image: data?.getFoodDetails?.image,
    title: data?.getFoodDetails?.title,
    description: data?.getFoodDetails?.description,
    isPopular: data?.getFoodDetails?.isPopular,
    // Todo: need to change this price, according to variations.
    price: data?.getFoodDetails?.variations[0].price,
    variations: data?.getFoodDetails?.variations,
    addons: data?.getFoodDetails?.addons || [],
    categoryId: data?.getFoodDetails?.categoryId
  }

  // Todo need to get the required data from backend.
  const productOtherDetails = {
    description: data?.getFoodDetails?.description,
    ingredients: ['Golden Delicious Apples', 'Filter Water', 'Ascorbic Acid'],
    usage: 'Keep refrigerated. Best served chilled.',
    nutritionFacts: {
      size: 'Amount per 100ml',
      energy: '89kJ/50kcal',
      fat: '20g',
      carbohydrates: '34g',
      protein: '0g',
      sugar: '50g'
    }
  }

  return { data, loading, error, currentTheme, t, productInfoData, productOtherDetails, updateUserCartLoading,addItemToCart }
}

export default useProductDetails
