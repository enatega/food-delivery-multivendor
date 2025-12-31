import { useQuery } from '@apollo/client'
import { GET_FOOD_DETAILS } from '../../apollo/queries'
import { useContext } from 'react'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'

const useProductDetails = ({ foodId }) => {
  // Todo: need to fix variations related data.
  const { data, loading, error } = useQuery(GET_FOOD_DETAILS, {
    variables: { foodId }
  })
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  console.log('useProductDetails data', data,error,foodId)
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
  }

  // Todo need to get the required data from backend.
  const productOtherDetails = {
    description: data?.getFoodDetails?.description,
    ingredients: ["Golden Delicious Apples", "Filter Water", "Ascorbic Acid"],
    usage: "Keep refrigerated. Best served chilled.",
    nutritionFacts: {
      size: "Amount per 100ml",
      energy: "89kJ/50kcal",
      fat: "20g",
      carbohydrates: "34g",
      protein: "0g",
      sugar: "50g",
    }
  }
  return { data, loading, error, currentTheme, t, productInfoData, productOtherDetails }
}

export default useProductDetails
